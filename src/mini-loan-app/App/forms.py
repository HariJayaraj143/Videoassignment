from flask_wtf import FlaskForm
from wtforms import StringField, FloatField, IntegerField, SubmitField, SelectField
from wtforms.validators import DataRequired, NumberRange, ValidationError

class LoanRequestForm(FlaskForm):
    """
    Form for customers to submit a loan request.
    """
    amount = FloatField(
        'Loan Amount ($)', 
        validators=[DataRequired(message="Amount is required"), NumberRange(min=1, message="Amount must be greater than 0")]
    )
    term = IntegerField(
        'Loan Term (Weeks)',
        validators=[DataRequired(message="Loan term is required"), NumberRange(min=1, message="Term must be at least 1 week")]
    )
    submit = SubmitField('Submit Loan Request')


class LoanApprovalForm(FlaskForm):
    """
    Form for admins to approve a loan.
    """
    loan_id = IntegerField(
        'Loan ID',
        validators=[DataRequired(message="Loan ID is required")]
    )
    submit = SubmitField('Approve Loan')


class RepaymentForm(FlaskForm):
    """
    Form for customers to submit repayments.
    """
    loan_id = IntegerField(
        'Loan ID',
        validators=[DataRequired(message="Loan ID is required")]
    )
    amount = FloatField(
        'Repayment Amount ($)',
        validators=[DataRequired(message="Amount is required"), NumberRange(min=0.01, message="Amount must be greater than 0")]
    )
    submit = SubmitField('Submit Repayment')
