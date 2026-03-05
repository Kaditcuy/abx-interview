from rest_framework import serializers
from .models import Department, Doctor, Patient, Appointment


class DepartmentSerializer(serializers.ModelSerializer):
    doctor_count = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = ['id', 'name', 'code', 'description', 'doctor_count', 'created_at']

    def get_doctor_count(self, obj):
        return obj.doctors.filter(is_active=True).count()


class DoctorSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = Doctor
        fields = [
            'id', 'first_name', 'last_name', 'specialty', 'department', 'department_name',
            'license_number', 'email', 'is_active', 'created_at'
        ]


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = [
            'id', 'first_name', 'last_name', 'date_of_birth', 'gender', 'phone', 'email',
            'address', 'emergency_contact', 'created_at'
        ]


class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'patient_name', 'doctor', 'doctor_name',
            'scheduled_at', 'status', 'notes', 'created_at'
        ]

    def get_patient_name(self, obj):
        return f"{obj.patient.last_name}, {obj.patient.first_name}"

    def get_doctor_name(self, obj):
        return f"Dr. {obj.doctor.last_name}, {obj.doctor.first_name}"
