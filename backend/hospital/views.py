from rest_framework import viewsets
from .models import Department, Doctor, Patient, Appointment
from .serializers import (
    DepartmentSerializer,
    DoctorSerializer,
    PatientSerializer,
    AppointmentSerializer,
)


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.select_related('department').filter(is_active=True)
    serializer_class = DoctorSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        if self.action == 'list' and self.request.query_params.get('include_inactive') == '1':
            qs = Doctor.objects.select_related('department').all()
        return qs


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.select_related('patient', 'doctor').all()
    serializer_class = AppointmentSerializer
