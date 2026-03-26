import React, { useEffect, useState } from "react";
import {
  Box, Button, Card, CardContent, Typography, Grid,
  TextField, Avatar, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, Paper, Divider, Fab,
  RadioGroup, FormControlLabel, Radio, Checkbox,
  FormControl, FormLabel, FormHelperText, FormGroup, Select, MenuItem,
  ListItemText, OutlinedInput, Chip
} from "@mui/material";import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';import { Delete, Edit, Add, Person, Email, School, Wc, Phone, LocationOn, Visibility, CalendarToday, Badge, MenuBook, Psychology, Close } from "@mui/icons-material";
import axios from "axios";

const StudentDashboard = () => {
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [snack, setSnack] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [viewStudent, setViewStudent] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    aadhaar: "",
    course: "",
    dob: null,
    gender: "",
    fathersName: "",
    mothersName: "",
    phoneNumber: "",
    address: "",
    registerNumber: "",
    yearOfStudy: "",
    department: "",
    admissionDate: null,
    skills: [],
    agreeToTerms: false,
    profilePic: null
  });

  // FETCH
  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students");
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // FILE
  const handleFile = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, profilePic: file });
  };

  // VALIDATION
  const validate = () => {
    let temp = {};
    if (!form.name) temp.name = "Name is required";
    if (!form.email) temp.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) temp.email = "Invalid email";
    if (!form.aadhaar) temp.aadhaar = "Aadhaar is required";
    else if (!/^\d{12}$/.test(form.aadhaar)) temp.aadhaar = "Aadhaar must be 12 digits";
    if (!form.course) temp.course = "Select course";
    if (!form.dob) temp.dob = "Date of birth is required";
    else {
      const birthDate = dayjs(form.dob);
      const today = dayjs();
      const age = today.year() - birthDate.year();
      if (age < 18 || age > 100) temp.dob = "Age must be between 18 and 100";
    }
    if (!form.gender) temp.gender = "Select gender";
    if (!form.fathersName) temp.fathersName = "Father's name is required";
    if (!form.mothersName) temp.mothersName = "Mother's name is required";
    if (!form.phoneNumber) temp.phoneNumber = "Phone number is required";
    else if (!/^\d{10}$/.test(form.phoneNumber)) temp.phoneNumber = "Phone number must be 10 digits";
    if (!form.address) temp.address = "Address is required";
    if (!form.registerNumber) temp.registerNumber = "Register Number is required";
    if (!form.yearOfStudy) temp.yearOfStudy = "Year of study is required";
    if (!form.department) temp.department = "Department is required";
    if (!form.admissionDate) temp.admissionDate = "Admission date is required";
    if (!form.agreeToTerms) temp.agreeToTerms = "You must agree to terms";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // SUBMIT
  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('email', form.email);
      data.append('aadhaar', form.aadhaar);
      data.append('course', form.course);
      data.append('dateOfBirth', form.dob ? dayjs(form.dob).format('YYYY-MM-DD') : '');
      data.append('gender', form.gender);
      data.append('fathersName', form.fathersName);
      data.append('mothersName', form.mothersName);
      data.append('phoneNumber', form.phoneNumber);
      data.append('address', form.address);
      data.append('registerNumber', form.registerNumber);
      data.append('yearOfStudy', form.yearOfStudy);
      data.append('department', form.department);
      data.append('admissionDate', form.admissionDate ? dayjs(form.admissionDate).format('YYYY-MM-DD') : '');
      data.append('skills', JSON.stringify(form.skills));
      data.append('agreeToTerms', form.agreeToTerms);
      if (form.profilePic) {
        data.append('profilePic', form.profilePic);
      }
      
      if (editing) {
        await axios.put(`http://localhost:5000/api/students/${editStudent._id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.post("http://localhost:5000/api/students", data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      setOpen(false);
      setSnack(true);
      fetchStudents();
      setEditing(false);
      setEditStudent(null);
      setForm({
        name: "",
        email: "",
        aadhaar: "",
        course: "",
        dob: null,
        gender: "",
        fathersName: "",
        mothersName: "",
        phoneNumber: "",
        address: "",
        registerNumber: "",
        yearOfStudy: "",
        department: "",
        admissionDate: null,
        skills: [],
        agreeToTerms: false,
        profilePic: null
      });
      setErrors({});
    } catch (error) {
      console.error("Error adding student:", error);
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: '#f0f2f8',
      backgroundImage: `
        radial-gradient(ellipse at 0% 0%, rgba(102,126,234,0.18) 0%, transparent 55%),
        radial-gradient(ellipse at 100% 100%, rgba(118,75,162,0.15) 0%, transparent 55%)
      `,
    }}>
      {/* TOP NAV BAR */}
      <Box sx={{
        background: 'linear-gradient(90deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
        px: 4, py: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 2px 20px rgba(0,0,0,0.25)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: '10px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <School sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#fff', lineHeight: 1.1 }}>
            Student Dashboard
            </Typography>
            <Typography sx={{ fontSize: '0.45rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Student Management
            </Typography>
          </Box>
        </Box>
        <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em' }}>
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, py: 4 }}>

        {/* PAGE HEADER */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1.7rem', color: '#1a1a2e', lineHeight: 1.2 }}>
              Student Dashboard
            </Typography>
            <Typography sx={{ color: '#8a94a6', fontSize: '0.88rem', mt: 0.5 }}>
              Manage and track all student records in one place
            </Typography>
          </Box>
            <Fab color="primary" aria-label="add" onClick={() => { setOpen(true); setEditing(false); setEditStudent(null); setForm({
              name: "",
              email: "",
              aadhaar: "",
              course: "",
              dob: null,
              gender: "",
              fathersName: "",
              mothersName: "",
              phoneNumber: "",
              address: "",
              registerNumber: "",
              yearOfStudy: "",
              department: "",
              admissionDate: null,
              skills: [],
              agreeToTerms: false,
              profilePic: null
            }); setErrors({}); }} variant="extended"
              sx={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', boxShadow: '0 6px 20px rgba(102,126,234,0.45)', fontWeight: 700, px: 3, '&:hover': { background: 'linear-gradient(135deg, #5c6bc0, #6a1b9a)' } }}>
              <Add sx={{ mr: 1 }} />
              Add Student
            </Fab>
        </Box>

        {/* SUMMARY CARDS */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              borderRadius: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              boxShadow: '0 8px 24px rgba(102,126,234,0.35)',
              border: 'none',
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Person sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {students.length}
                </Typography>
                <Typography>Total Students</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              borderRadius: 3,
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              boxShadow: '0 8px 24px rgba(245,87,108,0.35)',
              border: 'none',
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Wc sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {students.filter(s => s.gender === 'Male').length}
                </Typography>
                <Typography>Male Students</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              borderRadius: 3,
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              boxShadow: '0 8px 24px rgba(79,172,254,0.35)',
              border: 'none',
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Wc sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {students.filter(s => s.gender === 'Female').length}
                </Typography>
                <Typography>Female Students</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              borderRadius: 3,
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: 'white',
              boxShadow: '0 8px 24px rgba(67,233,123,0.35)',
              border: 'none',
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <School sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {students.filter(s => s.course === 'MERN').length}
                </Typography>
                <Typography>MERN Students</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* STUDENT CARDS */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#fff', border: '1px solid #e8eaf0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <Typography variant="h5" fontWeight="bold" mb={3} color="primary">
            Student Directory
          </Typography>
          <Grid container spacing={3}>
            {students.map((s) => (
              <Grid item xs={12} md={6} lg={4} key={s._id}>
                <Card sx={{ 
                  borderRadius: 3, 
                  boxShadow: 3, 
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
                  background: 'white'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Avatar
                        src={s.profilePic ? `http://localhost:5000/uploads/${s.profilePic}` : undefined}
                        sx={{ 
                          width: 64, 
                          height: 64, 
                          border: '3px solid #e3f2fd',
                          cursor: s.profilePic ? 'pointer' : 'default',
                          '&:hover': s.profilePic ? { transform: 'scale(1.05)' } : {}
                        }}
                        onClick={() => {
                          if (s.profilePic) {
                            window.open(`http://localhost:5000/uploads/${s.profilePic}`, '_blank');
                          }
                        }}
                      >
                        {!s.profilePic && <Person />}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                          {s.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {s.email}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <School color="action" />
                        <Typography variant="body2">
                          <strong>Register Number:</strong> {s.registerNumber}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Email color="action" />
                        <Typography variant="body2">
                          <strong>Email:</strong> {s.email}
                        </Typography>
                      </Box>
                    </Box>
                    <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
                      <IconButton 
                        color="info" 
                        size="small" 
                        onClick={() => { 
                          setViewStudent(s); 
                          setViewOpen(true); 
                        }}
                        sx={{ 
                          backgroundColor: '#e0f2f1',
                          '&:hover': { backgroundColor: '#b2dfdb' }
                        }}
                        title="View Details"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton color="primary" size="small" onClick={() => { 
                        setEditing(true); 
                        setEditStudent(s); 
                        setForm({
                          name: s.name,
                          email: s.email,
                          aadhaar: s.aadhaar,
                          course: s.course,
                          dob: dayjs(s.dob),
                          gender: s.gender,
                          fathersName: s.fathersName || "",
                          mothersName: s.mothersName || "",
                          phoneNumber: s.phoneNumber || "",
                          address: s.address || "",
                          registerNumber: s.registerNumber || "",
                          yearOfStudy: s.yearOfStudy || "",
                          department: s.department || "",
                          admissionDate: s.admissionDate ? dayjs(s.admissionDate) : null,
                          skills: s.skills || [],
                          agreeToTerms: s.agreeToTerms || false,
                          profilePic: null
                        }); 
                        setOpen(true); 
                        setErrors({}); 
                      }} sx={{ 
                        backgroundColor: '#e3f2fd',
                        '&:hover': { backgroundColor: '#bbdefb' }
                      }}>
                        <Edit />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        size="small" 
                        onClick={() => handleDelete(s._id)}
                        sx={{ 
                          backgroundColor: '#ffebee',
                          '&:hover': { backgroundColor: '#ffcdd2' }
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* FORM DIALOG */}
        <Dialog 
          open={open} 
          onClose={() => setOpen(false)} 
          fullWidth 
          maxWidth="lg"
          PaperProps={{
            sx: { 
              borderRadius: '12px', 
              maxHeight: '95vh', 
              overflow: 'auto',
              backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)'
            }
          }}
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            fontSize: '1.4rem',
            padding: '24px',
            borderBottom: 'none'
          }}>
            {editing ? <Edit sx={{ fontSize: '28px' }} /> : <Add sx={{ fontSize: '28px' }} />}
            {editing ? 'Edit Student Details' : 'Register New Student'}
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>

              {/* ══════════════════════════════════════════
                  SECTION 1 — PERSONAL INFORMATION
              ══════════════════════════════════════════ */}
              <Box sx={{ mb: 3, borderRadius: 3, border: '1.5px solid #dde3ff', backgroundColor: '#f8f9ff', p: 3 }}>

                {/* Section Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, pb: 2, borderBottom: '2px solid #dde3ff' }}>
                  <Box sx={{ width: 38, height: 38, borderRadius: '10px', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Person sx={{ color: '#fff', fontSize: 20 }} />
                  </Box>
                  <Typography sx={{ fontWeight: 700, color: '#3a3a72', fontSize: '1rem' }}>Personal Information</Typography>
                </Box>

                {/* ── 2-column CSS grid: guaranteed layout ── */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>

                  {/* Full Name */}
                  <TextField
                    label="Full Name" name="name" fullWidth
                    value={form.name} onChange={handleChange}
                    error={!!errors.name} helperText={errors.name}
                    InputProps={{ startAdornment: <Person sx={{ mr: 1, color: '#667eea', fontSize: 20 }} /> }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#fff', '& fieldset': { borderColor: '#d0d7f7' }, '&:hover fieldset': { borderColor: '#667eea' }, '&.Mui-focused fieldset': { borderColor: '#667eea', borderWidth: 2 } } }}
                  />

                  {/* Email Address */}
                  <TextField
                    label="Email Address" name="email" type="email" fullWidth
                    value={form.email} onChange={handleChange}
                    error={!!errors.email} helperText={errors.email}
                    InputProps={{ startAdornment: <Email sx={{ mr: 1, color: '#667eea', fontSize: 20 }} /> }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#fff', '& fieldset': { borderColor: '#d0d7f7' }, '&:hover fieldset': { borderColor: '#667eea' }, '&.Mui-focused fieldset': { borderColor: '#667eea', borderWidth: 2 } } }}
                  />

                  {/* Aadhaar Number */}
                  <TextField
                    label="Aadhaar Number" name="aadhaar" fullWidth
                    value={form.aadhaar} onChange={handleChange}
                    error={!!errors.aadhaar} helperText={errors.aadhaar || '12 digits'}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#fff', '& fieldset': { borderColor: '#d0d7f7' }, '&:hover fieldset': { borderColor: '#667eea' }, '&.Mui-focused fieldset': { borderColor: '#667eea', borderWidth: 2 } } }}
                  />

                  {/* Date of Birth */}
                  <DatePicker
                    label="Date of Birth" format="DD-MM-YYYY" value={form.dob}
                    onChange={(v) => { setForm({ ...form, dob: v }); setErrors({ ...errors, dob: '' }); }}
                    sx={{
                      width: '100%',
                      '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#fff' },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d7f7' },
                      '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' },
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea', borderWidth: '2px' },
                    }}
                    slotProps={{ textField: { fullWidth: true, error: !!errors.dob, helperText: errors.dob } }}
                  />

                  {/* Phone Number */}
                  <TextField
                    label="Phone Number" name="phoneNumber" fullWidth
                    value={form.phoneNumber} onChange={handleChange}
                    error={!!errors.phoneNumber} helperText={errors.phoneNumber || '10 digits'}
                    InputProps={{ startAdornment: <Phone sx={{ mr: 1, color: '#667eea', fontSize: 20 }} /> }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#fff', '& fieldset': { borderColor: '#d0d7f7' }, '&:hover fieldset': { borderColor: '#667eea' }, '&.Mui-focused fieldset': { borderColor: '#667eea', borderWidth: 2 } } }}
                  />

                  {/* Gender */}
                  <FormControl component="fieldset" error={!!errors.gender} fullWidth>
                    <FormLabel sx={{ fontWeight: 600, mb: 1, color: '#444', fontSize: '0.82rem', letterSpacing: '0.03em' }}>Gender</FormLabel>
                    <RadioGroup row name="gender" value={form.gender} onChange={handleChange}
                      sx={{ gap: 1, flexWrap: 'nowrap',
                        '& .MuiFormControlLabel-root': { m: 0, flex: 1, justifyContent: 'center', px: 1, py: 1, border: '2px solid #d0d7f7', borderRadius: 2, backgroundColor: '#fff', transition: 'all 0.2s', '&:hover': { borderColor: '#667eea', backgroundColor: '#f0f4ff' } },
                        '& .MuiRadio-root': { color: '#bbb', p: 0.5, '&.Mui-checked': { color: '#667eea' } },
                        '& .MuiFormControlLabel-label': { fontSize: '0.88rem' }
                      }}
                    >
                      <FormControlLabel value="Male" control={<Radio size="small" />} label="Male" />
                      <FormControlLabel value="Female" control={<Radio size="small" />} label="Female" />
                      <FormControlLabel value="Other" control={<Radio size="small" />} label="Other" />
                    </RadioGroup>
                    {errors.gender && <FormHelperText sx={{ color: '#d32f2f', mt: 0.5 }}>{errors.gender}</FormHelperText>}
                  </FormControl>

                  {/* Father's Name */}
                  <TextField
                    label="Father's Name" name="fathersName" fullWidth
                    value={form.fathersName} onChange={handleChange}
                    error={!!errors.fathersName} helperText={errors.fathersName}
                    InputProps={{ startAdornment: <Person sx={{ mr: 1, color: '#667eea', fontSize: 20 }} /> }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#fff', '& fieldset': { borderColor: '#d0d7f7' }, '&:hover fieldset': { borderColor: '#667eea' }, '&.Mui-focused fieldset': { borderColor: '#667eea', borderWidth: 2 } } }}
                  />

                  {/* Mother's Name */}
                  <TextField
                    label="Mother's Name" name="mothersName" fullWidth
                    value={form.mothersName} onChange={handleChange}
                    error={!!errors.mothersName} helperText={errors.mothersName}
                    InputProps={{ startAdornment: <Person sx={{ mr: 1, color: '#667eea', fontSize: 20 }} /> }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#fff', '& fieldset': { borderColor: '#d0d7f7' }, '&:hover fieldset': { borderColor: '#667eea' }, '&.Mui-focused fieldset': { borderColor: '#667eea', borderWidth: 2 } } }}
                  />

                  {/* Address — full width (spans 2 columns) */}
                  <TextField
                    label="Address" name="address" fullWidth multiline rows={2}
                    value={form.address} onChange={handleChange}
                    error={!!errors.address} helperText={errors.address}
                    InputProps={{ startAdornment: <LocationOn sx={{ mr: 1, color: '#667eea', fontSize: 20, alignSelf: 'flex-start', mt: '14px' }} /> }}
                    sx={{
                      gridColumn: '1 / -1',
                      '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#fff', '& fieldset': { borderColor: '#d0d7f7' }, '&:hover fieldset': { borderColor: '#667eea' }, '&.Mui-focused fieldset': { borderColor: '#667eea', borderWidth: 2 } }
                    }}
                  />

                  {/* Profile Picture — full width */}
                  <Box sx={{ gridColumn: '1 / -1' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#555', mb: 1, fontSize: '0.82rem', letterSpacing: '0.03em' }}>
                      Profile Picture
                    </Typography>
                    <Box sx={{ border: '2px dashed #b0bdf7', borderRadius: 2, p: 2.5, textAlign: 'center', backgroundColor: '#fff', transition: 'border-color 0.2s', '&:hover': { borderColor: '#667eea' } }}>
                      <input type="file" onChange={handleFile} accept="image/*"
                        style={{ width: '100%', padding: '6px 0', cursor: 'pointer' }}
                        id="profile-pic-input"
                      />
                      <Typography variant="caption" color="text.secondary">Accepted formats: JPG, PNG, JPEG</Typography>
                      {(form.profilePic || (editing && editStudent?.profilePic)) && (
                        <Box mt={1.5} px={2} py={1} sx={{ backgroundColor: '#f0f4ff', borderRadius: 2, display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ color: '#667eea', fontWeight: 600 }}>
                            {form.profilePic ? form.profilePic.name : editStudent?.profilePic}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#667eea', cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={() => {
                              if (form.profilePic) window.open(URL.createObjectURL(form.profilePic), '_blank');
                              else if (editing && editStudent?.profilePic) window.open(`http://localhost:5000/uploads/${editStudent.profilePic}`, '_blank');
                            }}
                          >(preview)
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>

                </Box>
              </Box>

              {/* ══════════════════════════════════════════
                  SECTION 2 — ACADEMIC INFORMATION
              ══════════════════════════════════════════ */}
              <Box sx={{ borderRadius: 3, border: '1.5px solid #c0e8d8', backgroundColor: '#f4fdf9', p: 3 }}>

                {/* Section Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, pb: 2, borderBottom: '2px solid #c0e8d8' }}>
                  <Box sx={{ width: 38, height: 38, borderRadius: '10px', background: 'linear-gradient(135deg, #11998e, #38ef7d)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <School sx={{ color: '#fff', fontSize: 20 }} />
                  </Box>
                  <Typography sx={{ fontWeight: 700, color: '#1a5740', fontSize: '1rem' }}>Academic Information</Typography>
                </Box>

                {/* ── 2-column CSS grid: guaranteed layout ── */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>

                  {/* Register Number */}
                  <FormControl fullWidth error={!!errors.registerNumber}>
                    <FormLabel sx={{ fontWeight: 600, mb: 1, color: '#444', fontSize: '0.82rem', letterSpacing: '0.03em' }}>Register Number</FormLabel>
                    <TextField
                      name="registerNumber" fullWidth
                      value={form.registerNumber} onChange={handleChange}
                      error={!!errors.registerNumber} helperText={errors.registerNumber}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#fff', '& fieldset': { borderColor: '#a8d8c5' }, '&:hover fieldset': { borderColor: '#11998e' }, '&.Mui-focused fieldset': { borderColor: '#11998e', borderWidth: 2 } } }}
                    />
                  </FormControl>

                  {/* Department */}
                  <FormControl fullWidth error={!!errors.department}>
                    <FormLabel sx={{ fontWeight: 600, mb: 1, color: '#444', fontSize: '0.82rem', letterSpacing: '0.03em' }}>Department</FormLabel>
                    <Select value={form.department} onChange={handleChange} name="department" displayEmpty
                      sx={{ borderRadius: 2, backgroundColor: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#a8d8c5' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#11998e' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#11998e', borderWidth: 2 } }}
                    >
                      <MenuItem value="" disabled>Select Department</MenuItem>
                      <MenuItem value="Computer Science">Computer Science</MenuItem>
                      <MenuItem value="Information Technology">Information Technology</MenuItem>
                      <MenuItem value="Mechanical Engineering">Mechanical Engineering</MenuItem>
                      <MenuItem value="Electrical Engineering">Electrical Engineering</MenuItem>
                      <MenuItem value="Civil Engineering">Civil Engineering</MenuItem>
                      <MenuItem value="Electronics Engineering">Electronics Engineering</MenuItem>
                      <MenuItem value="Chemical Engineering">Chemical Engineering</MenuItem>
                      <MenuItem value="Biotechnology">Biotechnology</MenuItem>
                      <MenuItem value="Business Administration">Business Administration</MenuItem>
                      <MenuItem value="Commerce">Commerce</MenuItem>
                    </Select>
                    {errors.department && <FormHelperText sx={{ color: '#d32f2f', mt: 0.5 }}>{errors.department}</FormHelperText>}
                  </FormControl>

                  {/* Select Course — full width */}
                  <Box sx={{ gridColumn: '1 / -1' }}>
                    <FormControl component="fieldset" error={!!errors.course} fullWidth>
                      <FormLabel sx={{ fontWeight: 600, mb: 1.5, color: '#444', fontSize: '0.82rem', letterSpacing: '0.03em' }}>Select Course</FormLabel>
                      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                        {[{ val: 'MERN', label: 'MERN Stack' }, { val: 'Java', label: 'Java Development' }, { val: 'Python', label: 'Python Development' }].map(({ val, label }) => (
                          <Box key={val}
                            onClick={() => { setForm({ ...form, course: val }); setErrors({ ...errors, course: '' }); }}
                            sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2.5, py: 1.2, border: `2px solid ${form.course === val ? '#11998e' : '#a8d8c5'}`, borderRadius: 2, backgroundColor: form.course === val ? '#e6f9f3' : '#fff', cursor: 'pointer', transition: 'all 0.2s', flex: 1, minWidth: '140px', '&:hover': { borderColor: '#11998e', backgroundColor: '#edf9f4' } }}
                          >
                            <Radio size="small" checked={form.course === val} readOnly sx={{ p: 0, color: '#a8d8c5', '&.Mui-checked': { color: '#11998e' } }} />
                            <Typography variant="body2" sx={{ fontWeight: form.course === val ? 700 : 400, color: form.course === val ? '#11998e' : '#333' }}>{label}</Typography>
                          </Box>
                        ))}
                      </Box>
                      {errors.course && <FormHelperText sx={{ color: '#d32f2f', mt: 0.5 }}>{errors.course}</FormHelperText>}
                    </FormControl>
                  </Box>

                  {/* Year of Study — dropdown with radio buttons */}
                  <FormControl fullWidth error={!!errors.yearOfStudy}>
                    <FormLabel sx={{ fontWeight: 600, mb: 1, color: '#444', fontSize: '0.82rem', letterSpacing: '0.03em' }}>Year of Study</FormLabel>
                    <Select
                      displayEmpty
                      value={form.yearOfStudy || ''}
                      onChange={(e) => { setForm({ ...form, yearOfStudy: e.target.value }); setErrors({ ...errors, yearOfStudy: '' }); }}
                      renderValue={(selected) =>
                        selected ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#11998e' }} />
                            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#11998e' }}>{selected}</Typography>
                          </Box>
                        ) : (
                          <Typography sx={{ color: '#aaa', fontSize: '0.9rem' }}>Select year of study...</Typography>
                        )
                      }
                      MenuProps={{ PaperProps: { sx: { borderRadius: 2, mt: 0.5, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' } } }}
                      sx={{
                        borderRadius: 2, backgroundColor: '#fff',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#a8d8c5' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#11998e' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#11998e', borderWidth: 2 },
                      }}
                    >
                      {['1st Year', '2nd Year', '3rd Year', '4th Year'].map((yr) => (
                        <MenuItem key={yr} value={yr}
                          sx={{ '&:hover': { backgroundColor: '#edf9f4' }, '&.Mui-selected': { backgroundColor: '#e6f9f3' }, '&.Mui-selected:hover': { backgroundColor: '#d0f5e8' } }}
                        >
                          <Radio size="small" checked={form.yearOfStudy === yr} readOnly
                            sx={{ p: 0, mr: 1.5, color: '#a8d8c5', '&.Mui-checked': { color: '#11998e' } }}
                          />
                          <ListItemText
                            primary={yr}
                            primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: form.yearOfStudy === yr ? 700 : 400, color: form.yearOfStudy === yr ? '#11998e' : '#333' }}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.yearOfStudy && <FormHelperText sx={{ color: '#d32f2f', mt: 0.5 }}>{errors.yearOfStudy}</FormHelperText>}
                  </FormControl>

                  {/* Skills & Interests | Admission Date — same row, equal columns */}
                  <FormControl fullWidth>
                    <FormLabel sx={{ fontWeight: 600, mb: 1, color: '#444', fontSize: '0.82rem', letterSpacing: '0.03em' }}>Skills & Interests</FormLabel>
                    <Select
                      multiple
                      displayEmpty
                      value={form.skills || []}
                      onChange={(e) => setForm({ ...form, skills: e.target.value })}
                      input={<OutlinedInput />}
                      renderValue={(selected) =>
                        selected.length === 0 ? (
                          <Typography variant="body2" sx={{ color: '#aaa' }}>Select skills...</Typography>
                        ) : (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                            {selected.map((skill) => (
                              <Chip
                                key={skill}
                                label={skill}
                                size="small"
                                sx={{ backgroundColor: '#e6f9f3', color: '#11998e', fontWeight: 600, border: '1px solid #a8d8c5', borderRadius: '6px', fontSize: '0.78rem' }}
                              />
                            ))}
                          </Box>
                        )
                      }
                      MenuProps={{ PaperProps: { sx: { maxHeight: 260, borderRadius: 2, mt: 0.5, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' } } }}
                      sx={{
                        borderRadius: 2, backgroundColor: '#fff',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#a8d8c5' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#11998e' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#11998e', borderWidth: 2 }
                      }}
                    >
                      {['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'Database', 'UI/UX'].map((skill) => (
                        <MenuItem key={skill} value={skill}
                          sx={{ '&:hover': { backgroundColor: '#edf9f4' }, '&.Mui-selected': { backgroundColor: '#e6f9f3' }, '&.Mui-selected:hover': { backgroundColor: '#d0f5e8' } }}
                        >
                          <Checkbox size="small" checked={(form.skills || []).includes(skill)}
                            sx={{ p: 0, mr: 1.5, color: '#a8d8c5', '&.Mui-checked': { color: '#11998e' } }}
                          />
                          <ListItemText
                            primary={skill}
                            primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: (form.skills || []).includes(skill) ? 600 : 400, color: (form.skills || []).includes(skill) ? '#11998e' : '#333' }}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <FormLabel sx={{ fontWeight: 600, mb: 1, color: '#444', fontSize: '0.82rem', letterSpacing: '0.03em' }}>Admission Date</FormLabel>
                    <DatePicker
                      format="DD-MM-YYYY" value={form.admissionDate}
                      onChange={(v) => { setForm({ ...form, admissionDate: v }); setErrors({ ...errors, admissionDate: '' }); }}
                      sx={{
                        width: '100%',
                        '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#fff' },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#a8d8c5' },
                        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#11998e' },
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#11998e', borderWidth: '2px' },
                      }}
                      slotProps={{ textField: { fullWidth: true, error: !!errors.admissionDate, helperText: errors.admissionDate } }}
                    />
                  </FormControl>

                  {/* Terms & Conditions — full width */}
                  <Box sx={{ gridColumn: '1 / -1' }}>
                    <Box
                      onClick={() => setForm({ ...form, agreeToTerms: !form.agreeToTerms })}
                      sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 1.5, border: `1px solid ${form.agreeToTerms ? '#f7cc67' : '#f3d580'}`, borderRadius: 2, backgroundColor: '#fffbea', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { borderColor: '#e6a817', backgroundColor: '#fff8d6' } }}
                    >
                      <Checkbox size="small" checked={form.agreeToTerms || false} readOnly
                        sx={{ p: 0, color: '#f1c64f', '&.Mui-checked': { color: '#f0b429' } }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#5a4000' }}>
                        I agree to the terms and conditions
                      </Typography>
                    </Box>
                    {errors.agreeToTerms && <FormHelperText error sx={{ mt: 0.5 }}>{errors.agreeToTerms}</FormHelperText>}
                  </Box>

                </Box>
              </Box>

            </LocalizationProvider>
          </DialogContent>
          <DialogActions sx={{ p: '24px', pt: '20px', justifyContent: 'flex-end', gap: 2, borderTop: '1px solid #e0e0e0' }}>
            <Button 
              onClick={() => setOpen(false)} 
              variant="outlined"
              sx={{ 
                borderRadius: '8px',
                px: 4,
                py: 1.2,
                fontSize: '0.95rem',
                fontWeight: '600',
                borderColor: '#ccc',
                color: '#666',
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#999',
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSubmit}
              disabled={loading || !form.agreeToTerms}
              sx={{ 
                borderRadius: '8px',
                px: 5,
                py: 1.2,
                fontSize: '0.95rem',
                fontWeight: '600',
                textTransform: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                },
                '&:disabled': {
                  background: '#ccc',
                  boxShadow: 'none'
                }
              }}
            >
              {loading ? 'Saving...' : (editing ? 'Update Student' : 'Save Student')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* VIEW DETAILS MODAL */}
        <Dialog
          open={viewOpen}
          onClose={() => setViewOpen(false)}
          fullWidth
          maxWidth="md"
          PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
        >
          <DialogContent sx={{ p: 0 }}>
            {viewStudent && (
              <>
                {/* ── HERO AREA ── */}
                <Box sx={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', position: 'relative' }}>
                  <IconButton
                    onClick={() => setViewOpen(false)}
                    sx={{
                      position: 'absolute', top: 12, right: 12,
                      color: '#334155', backgroundColor: '#fff', border: '1px solid #cbd5e1',
                      '&:hover': { backgroundColor: '#f1f5f9' },
                      width: 36, height: 36,
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                  <Box sx={{ px: 4, py: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Avatar
                        src={viewStudent.profilePic ? `http://localhost:5000/uploads/${viewStudent.profilePic}` : undefined}
                        sx={{
                          width: 100, height: 100,
                          border: '2px solid #3f51b5',
                          boxShadow: '0 8px 18px rgba(63,81,181,0.25)',
                          backgroundColor: '#fff'
                        }}
                      >
                        {!viewStudent.profilePic && <Person sx={{ fontSize: 44, color: '#3f51b5' }} />}
                      </Avatar>
                    </Box>

                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Typography variant="h6" fontWeight={700} sx={{ color: '#1e293b', mb: 0.4 }}>
                        {viewStudent.name}
                      </Typography>
                      <Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>
                        {/* {viewStudent.department} • */}
                         Reg. No: {viewStudent.registerNumber}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ px: 4, pb: 4 }}>
                  {/* ── PERSONAL INFORMATION ── */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Box sx={{ width: 4, height: 22, borderRadius: 2, backgroundColor: '#667eea' }} />
                      <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#333', fontSize: '0.88rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        Personal Information
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                      {[
                        { icon: <Email sx={{ fontSize: 16 }} />, label: 'Email Address', value: viewStudent.email, fullWidth: false },
                        { icon: <Badge sx={{ fontSize: 16 }} />, label: 'Aadhaar Number', value: viewStudent.aadhaar, fullWidth: false },
                        { icon: <CalendarToday sx={{ fontSize: 16 }} />, label: 'Date of Birth', value: viewStudent.dob ? new Date(viewStudent.dob).toLocaleDateString('en-GB') : 'N/A', fullWidth: false },
                        { icon: <Wc sx={{ fontSize: 16 }} />, label: 'Gender', value: viewStudent.gender, fullWidth: false },
                        { icon: <Person sx={{ fontSize: 16 }} />, label: "Father's Name", value: viewStudent.fathersName, fullWidth: false },
                        { icon: <Person sx={{ fontSize: 16 }} />, label: "Mother's Name", value: viewStudent.mothersName, fullWidth: false },
                        { icon: <Phone sx={{ fontSize: 16 }} />, label: 'Phone Number', value: viewStudent.phoneNumber, fullWidth: false },
                        { icon: <LocationOn sx={{ fontSize: 16 }} />, label: 'Address', value: viewStudent.address, fullWidth: true },
                      ].map(({ icon, label, value, fullWidth }) => (
                        <Box key={label} sx={{
                          gridColumn: fullWidth ? '1 / -1' : undefined,
                          display: 'flex', alignItems: 'flex-start', gap: 1.5,
                          backgroundColor: '#fff', borderRadius: 2.5, p: 1.8,
                          border: '1px solid #e2e8f0',
                        }}>
                          <Box sx={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: '#e8eaf6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3f51b5', flexShrink: 0, mt: 0.2 }}>
                            {icon}
                          </Box>
                          <Box>
                            <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', lineHeight: 1.2, mb: 0.4 }}>{label}</Typography>
                            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', lineHeight: 1.4 }}>{value || 'N/A'}</Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* ── ACADEMIC INFORMATION ── */}
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Box sx={{ width: 4, height: 22, borderRadius: 2, backgroundColor: '#11998e' }} />
                      <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#333', fontSize: '0.88rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        Academic Information
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                      {[
                        { icon: <MenuBook sx={{ fontSize: 16 }} />, label: 'Course', value: viewStudent.course },
                        { icon: <School sx={{ fontSize: 16 }} />, label: 'Year of Study', value: viewStudent.yearOfStudy },
                        { icon: <School sx={{ fontSize: 16 }} />, label: 'Department', value: viewStudent.department },
                        { icon: <CalendarToday sx={{ fontSize: 16 }} />, label: 'Admission Date', value: viewStudent.admissionDate ? new Date(viewStudent.admissionDate).toLocaleDateString('en-GB') : 'N/A' },
                      ].map(({ icon, label, value }) => (
                        <Box key={label} sx={{
                          display: 'flex', alignItems: 'flex-start', gap: 1.5,
                          backgroundColor: '#fff', borderRadius: 2.5, p: 1.8,
                          border: '1px solid #e2e8f0',
                        }}>
                          <Box sx={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: '#e8eaf6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3f51b5', flexShrink: 0, mt: 0.2 }}>
                            {icon}
                          </Box>
                          <Box>
                            <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', lineHeight: 1.2, mb: 0.4 }}>{label}</Typography>
                            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', lineHeight: 1.4 }}>{value || 'N/A'}</Typography>
                          </Box>
                        </Box>
                      ))}
                      {/* Skills — full width, clean tag style */}
                      {viewStudent.skills && viewStudent.skills.length > 0 && (
                        <Box sx={{ gridColumn: '1 / -1', backgroundColor: '#e3f2fd', borderRadius: 2.5, p: 2, border: '1px solid #90caf922' }}>
                          <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#1565c0', textTransform: 'uppercase', letterSpacing: '0.09em', mb: 1.5 }}>
                            Skills &amp; Interests
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {viewStudent.skills.map((skill) => (
                              <Box key={skill} sx={{
                                px: 1.8, py: 0.55,
                                borderRadius: '6px',
                                backgroundColor: '#fff',
                                borderLeft: '3px solid #1565c0',
                              }}>
                                <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#1a1a2e', lineHeight: 1.3 }}>
                                  {skill}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 4, py: 2.5, borderTop: '1px solid #f0f0f0', backgroundColor: '#fafafa', gap: 1.5 }}>
            <Button
              onClick={() => {
                setViewOpen(false);
                setEditing(true);
                setEditStudent(viewStudent);
                setForm({
                  name: viewStudent.name,
                  email: viewStudent.email,
                  aadhaar: viewStudent.aadhaar,
                  course: viewStudent.course,
                  dob: dayjs(viewStudent.dob),
                  gender: viewStudent.gender,
                  fathersName: viewStudent.fathersName || "",
                  mothersName: viewStudent.mothersName || "",
                  phoneNumber: viewStudent.phoneNumber || "",
                  address: viewStudent.address || "",
                  registerNumber: viewStudent.registerNumber || "",
                  yearOfStudy: viewStudent.yearOfStudy || "",
                  department: viewStudent.department || "",
                  admissionDate: viewStudent.admissionDate ? dayjs(viewStudent.admissionDate) : null,
                  skills: viewStudent.skills || [],
                  agreeToTerms: viewStudent.agreeToTerms || false,
                  profilePic: null
                });
                setOpen(true);
                setErrors({});
              }}
              variant="outlined"
              startIcon={<Edit />}
              sx={{ borderRadius: 2.5, px: 3, borderColor: '#667eea', color: '#667eea', fontWeight: 600, '&:hover': { borderColor: '#5c6bc0', backgroundColor: '#ede7f6' } }}
            >
              Edit Student
            </Button>
            <Button
              onClick={() => setViewOpen(false)}
              variant="contained"
              sx={{ borderRadius: 2.5, px: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontWeight: 600, boxShadow: '0 4px 12px rgba(102,126,234,0.4)', '&:hover': { background: 'linear-gradient(135deg, #5c6bc0 0%, #6a1b9a 100%)' } }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* SUCCESS SNACKBAR */}
        <Snackbar 
          open={snack} 
          autoHideDuration={4000} 
          onClose={() => setSnack(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setSnack(false)} 
            severity="success" 
            sx={{ width: '100%', borderRadius: 2 }}
          >
            Student added successfully!
          </Alert>
        </Snackbar>

      </Box>
    </Box>
  );
};

export default StudentDashboard;