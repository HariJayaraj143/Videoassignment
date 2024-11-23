from datetime import datetime, timedelta
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    role = db.Column(db.String(10), nullable=False)  # 'customer' or 'admin'

class Loan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    term = db.Column(db.Integer, nullable=False)  # number of weeks
    state = db.Column(db.String(10), default='PENDING')
    customer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class ScheduledRepayment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(10), default='PENDING')
    loan_id = db.Column(db.Integer, db.ForeignKey('loan.id'), nullable=False)
