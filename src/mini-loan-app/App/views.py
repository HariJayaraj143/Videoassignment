from flask import Flask, request, jsonify
from models import db, User, Loan, ScheduledRepayment
from datetime import datetime, timedelta

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///loan_app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)


@app.route('/loan', methods=['POST'])
def create_loan():
    """
    Create a loan request.
    """
    try:
        data = request.json
        user_id = data.get('user_id')
        amount = data.get('amount')
        term = data.get('term')

        # Validate inputs
        if not user_id or not amount or not term:
            return jsonify({'error': 'Missing required fields'}), 400

        user = User.query.get(user_id)
        if not user or user.role != 'customer':
            return jsonify({'error': 'Invalid user'}), 403

        # Create loan
        loan = Loan(amount=amount, term=term, customer_id=user_id)
        db.session.add(loan)
        db.session.commit()

        # Generate repayment schedule
        weekly_amount = round(amount / term, 2)
        remainder = amount - (weekly_amount * (term - 1))
        start_date = datetime.now()

        for i in range(term):
            repayment_date = start_date + timedelta(weeks=i + 1)
            repayment_amount = weekly_amount if i < term - 1 else remainder
            repayment = ScheduledRepayment(
                date=repayment_date.date(),
                amount=repayment_amount,
                loan_id=loan.id
            )
            db.session.add(repayment)

        db.session.commit()
        return jsonify({'message': 'Loan created successfully', 'loan_id': loan.id}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/loan/approve/<int:loan_id>', methods=['POST'])
def approve_loan(loan_id):
    """
    Approve a loan (admin only).
    """
    try:
        data = request.json
        admin_id = data.get('admin_id')

        # Validate admin
        admin = User.query.get(admin_id)
        if not admin or admin.role != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403

        # Fetch and approve loan
        loan = Loan.query.get(loan_id)
        if not loan or loan.state != 'PENDING':
            return jsonify({'error': 'Loan not found or already processed'}), 404

        loan.state = 'APPROVED'
        db.session.commit()
        return jsonify({'message': 'Loan approved successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/loans', methods=['GET'])
def get_loans():
    """
    Fetch loans for the logged-in user (customer or admin).
    """
    try:
        user_id = request.args.get('user_id')
        user = User.query.get(user_id)

        if not user:
            return jsonify({'error': 'Invalid user'}), 403

        if user.role == 'admin':
            loans = Loan.query.all()
        else:
            loans = Loan.query.filter_by(customer_id=user_id).all()

        loans_data = [
            {
                'id': loan.id,
                'amount': loan.amount,
                'term': loan.term,
                'state': loan.state,
                'repayments': [
                    {
                        'id': repayment.id,
                        'date': repayment.date,
                        'amount': repayment.amount,
                        'status': repayment.status
                    } for repayment in loan.scheduledrepayment_set
                ]
            }
            for loan in loans
        ]
        return jsonify(loans_data), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/repayment/<int:loan_id>', methods=['POST'])
def add_repayment(loan_id):
    """
    Add a repayment for a loan.
    """
    try:
        data = request.json
        user_id = data.get('user_id')
        repayment_amount = data.get('amount')

        # Validate user
        user = User.query.get(user_id)
        if not user or user.role != 'customer':
            return jsonify({'error': 'Unauthorized'}), 403

        loan = Loan.query.get(loan_id)
        if not loan or loan.customer_id != user_id or loan.state != 'APPROVED':
            return jsonify({'error': 'Loan not found or not eligible for repayment'}), 404

        # Find the next unpaid repayment
        next_repayment = ScheduledRepayment.query.filter_by(
            loan_id=loan_id, status='PENDING'
        ).order_by(ScheduledRepayment.date).first()

        if not next_repayment:
            return jsonify({'error': 'No pending repayments for this loan'}), 400

        if repayment_amount < next_repayment.amount:
            return jsonify({'error': 'Repayment amount is less than scheduled amount'}), 400

        # Mark repayment as paid
        next_repayment.status = 'PAID'
        db.session.commit()

        # Check if all repayments are complete
        remaining_repayments = ScheduledRepayment.query.filter_by(
            loan_id=loan_id, status='PENDING'
        ).count()

        if remaining_repayments == 0:
            loan.state = 'PAID'
            db.session.commit()

        return jsonify({'message': 'Repayment successful'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
