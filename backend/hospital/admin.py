from django.contrib import admin
from .models import Department, Doctor, Patient, Appointment


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'created_at']
    search_fields = ['name', 'code']


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ['last_name', 'first_name', 'specialty', 'department', 'is_active']
    list_filter = ['department', 'is_active']
    search_fields = ['first_name', 'last_name', 'license_number']


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['last_name', 'first_name', 'date_of_birth', 'phone']
    search_fields = ['first_name', 'last_name', 'email', 'phone']


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['patient', 'doctor', 'scheduled_at', 'status']
    list_filter = ['status']
    date_hierarchy = 'scheduled_at'
