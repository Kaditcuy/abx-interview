"""
Load sample departments, doctors, and patients.
Run: python manage.py load_hospital_data
"""
from django.core.management.base import BaseCommand
from hospital.models import Department, Doctor, Patient


class Command(BaseCommand):
    help = "Insert sample data for departments, doctors, and patients."

    def handle(self, *args, **options):
        # Departments
        depts = [
            {"code": "ER", "name": "Emergency", "description": "Emergency room"},
            {"code": "CARD", "name": "Cardiology", "description": "Heart and cardiovascular"},
            {"code": "PED", "name": "Pediatrics", "description": "Children's health"},
        ]
        created_depts = {}
        for d in depts:
            obj, created = Department.objects.get_or_create(code=d["code"], defaults=d)
            created_depts[d["code"]] = obj
            if created:
                self.stdout.write(f"Created department: {obj.name}")

        er = created_depts["ER"]
        card = created_depts["CARD"]
        ped = created_depts["PED"]

        # Doctors (first_name, last_name, specialty, department, image)
        doctors_data = [
            ("Sarah", "Chen", "Emergency Medicine", er, "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200"),
            ("James", "Okonkwo", "Cardiology", card, "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200"),
            ("Maria", "Garcia", "Pediatrics", ped, "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200"),
            ("David", "Kim", "Emergency Medicine", er, ""),
            ("Emma", "Williams", "Cardiology", card, ""),
        ]
        for first, last, spec, dept, img in doctors_data:
            _, created = Doctor.objects.get_or_create(
                first_name=first,
                last_name=last,
                specialty=spec,
                defaults={"department": dept, "image": img},
            )
            if created:
                self.stdout.write(f"Created doctor: Dr. {last}, {first}")

        # Patients (first_name, last_name, phone, email, image)
        patients_data = [
            ("John", "Smith", "+1-555-0101", "john.smith@example.com", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"),
            ("Anna", "Johnson", "+1-555-0102", "anna.j@example.com", ""),
            ("Michael", "Brown", "+1-555-0103", "mbrown@example.com", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200"),
            ("Lisa", "Davis", "+1-555-0104", "lisa.davis@example.com", ""),
            ("Robert", "Wilson", "+1-555-0105", "rwilson@example.com", ""),
        ]
        for first, last, phone, email, img in patients_data:
            _, created = Patient.objects.get_or_create(
                first_name=first,
                last_name=last,
                defaults={"phone": phone, "email": email, "image": img},
            )
            if created:
                self.stdout.write(f"Created patient: {last}, {first}")

        self.stdout.write(self.style.SUCCESS("Sample data loaded."))
