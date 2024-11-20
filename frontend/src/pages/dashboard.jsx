import * as React from 'react';
import AddIcon from '@mui/icons-material/Add';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Alert, Button, Input, Snackbar } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import contactService from './../services/contactService';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
// import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import MuiCard from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import MovingTwoTone from '@mui/icons-material/MovingTwoTone'
import DeleteOutlineTwoTone from '@mui/icons-material/DeleteOutlineTwoTone'
import TablePagination from '@mui/material/TablePagination';
import CloseIcon from '@mui/icons-material/CloseSharp';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
}));

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '35rem',
    padding: theme.spacing(3),
    gap: theme.spacing(2),
    margin: 'auto',
    height: '30.5rem',
    overflowY: 'auto',
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
}));

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '40rem',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const initialState = {
    firstname: false,
    lastname: false,
    email: false,
    phone: false,
    company: false,
    job: false,
    emailMessage: '',
    phoneMessage: '',
}

export default function Dashboard() {
    const [rows, setRows] = React.useState([]);
    const [search, setSearch] = React.useState("");
    const [fetch, setFetch] = React.useState(false);
    const [details, setDetails] = React.useState({});
    const [open, setOpen] = React.useState(false);
    const [errors, setErrors] = React.useState(initialState);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [alertState, setAlertState] = React.useState({
        open: false,
        message: '',
        severity: 'success',
    });

    // Function to show alert
    const showAlert = (message, severity ) => {
        setAlertState({
            open: true,
            message,
            severity,
        });
    };

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertState({ ...alertState, open: false });
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setDetails({});
        setErrors({});
        setOpen(false);
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateInputs()) {
            const data = new FormData(event.currentTarget);
            const sendData = {
                firstname: data.get('firstname'),
                lastname: data.get('lastname'),
                email: data.get('email'),
                phone_no: data.get('phone_no'),
                company: data.get('company'),
                job_title: data.get('job_title'),
            };

            try {
                let res;
                if (details.id) {
                    res = await contactService.updateContact(details.id, sendData);
                    showAlert("Contact Updated Successfully", "success")
                } else {
                    res = await contactService.addContact(sendData);
                    showAlert("Contact Added Successfully" , "success")
                }
                if (res?.result) setFetch(!fetch);
                handleClose();
            } catch (error) {
                showAlert('Failed to save contact. Please try again.', 'error')
                handleClose();
                console.log('Error saving contact:', error);
            }
        }
    };

    const validateInputs = () => {
        const email = document.getElementById('email');
        const firstname = document.getElementById('firstname');
        const lastname = document.getElementById('lastname');
        const phone = document.getElementById('phone_no');
        const company = document.getElementById('company');
        const job = document.getElementById('job_title');

        let isValid = true;
        const newErrors = {};

        if (!company.value) {
            newErrors.company = true;
            isValid = false;
        }

        if (!firstname.value) {
            newErrors.firstname = true;
            isValid = false;
        }

        if (!lastname.value) {
            newErrors.lastname = true;
            isValid = false;
        }

        if (!job.value) {
            newErrors.job = true;
            isValid = false;
        }

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            newErrors.email = true;
            newErrors.emailMessage = 'Please enter a valid email address.';
            isValid = false;
        }

        if (!phone.value || !/^\d{10}$/.test(phone.value)) {
            newErrors.phone = true;
            newErrors.phoneMessage = 'Enter a valid phone number';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const deleteContact = async (id) => {
        try {
            await contactService.deleteContact(id);
            showAlert("Contact Deleted Successfully" , "success")
            setFetch(!fetch);
        } catch (error) {
            showAlert('Failed to delete contact.', 'error')
            console.log('Error deleting contact:', error);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const fetchContacts = React.useCallback(async () => {
        try {
            const res = await contactService.getAllContacts(search);
            if (res && res.result) {
                setRows(res.data);
            }
        } catch (error) {
            console.error('Error fetching contacts', error);
            showAlert('Failed to fetch contacts. Please try again.', 'error');
        }
    }, [search]);

    React.useEffect(() => {
        fetchContacts();
    }, [fetchContacts, fetch]);

    return (
        <React.Fragment>
            <CssBaseline />
            <Snackbar
                open={alertState.open}
                autoHideDuration={4000}
                onClose={handleAlertClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleAlertClose}
                    severity={alertState.severity}
                    sx={{ width: '100%' }}
                    action={
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={handleAlertClose}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    {alertState.message}
                </Alert>
            </Snackbar>
            <Container>
                <Modal
                    aria-labelledby="Contact-form"
                    aria-describedby="Add || Update contact details"
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            timeout: 500,
                        },
                    }}>
                    <Fade in={open}>
                        <Card variant="outlined" sx={style}>
                            <Box
                                component="form"
                                onSubmit={handleSubmit}
                                noValidate
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                }}>
                                <FormControl>
                                    {/* <FormLabel htmlFor="FirstName" sx={{
                                            textAlign: "start",
                                            fontSize: 15,
                                            color: "black"
                                        }}>FirstName</FormLabel> */}
                                    <Input id='firstname' name='firstname' type='text' placeholder='FirstName' autoComplete="firstname" autoFocus required fullWidth
                                        sx={{
                                            textAlign: "start",
                                            fontSize: 15,
                                            padding: 1,
                                            color: "black"
                                        }}
                                        error={errors.firstname}
                                        defaultValue={details.firstname} />

                                </FormControl>
                                <FormControl>
                                    {/* <FormLabel htmlFor="password" sx={{
                                            textAlign: "start",
                                            fontSize: 15,
                                            padding: 1,
                                            color: "black"
                                        }}>Password</FormLabel> */}
                                    <Input id='lastname' name='lastname' type='text' placeholder='LirstName' autoComplete="lastname" required fullWidth
                                        sx={{
                                            textAlign: "start",
                                            fontSize: 15,
                                            padding: 1,
                                            color: "black"
                                        }}
                                        error={errors.lastname}
                                        defaultValue={details.lastname} />
                                </FormControl>
                                <FormControl>
                                    {/* <FormLabel htmlFor="password" sx={{
                                            textAlign: "start",
                                            fontSize: 15,
                                            padding: 1,
                                            color: "black"
                                        }}>Password</FormLabel> */}
                                    <Input id='email' name='email' type='email' placeholder='Email' autoComplete="email" autoFocus required fullWidth
                                        sx={{
                                            textAlign: "start",
                                            fontSize: 15,
                                            padding: 1,
                                            color: "black"
                                        }}
                                        error={errors.email}
                                        defaultValue={details.email} />
                                    {!errors.email ? "" : <small style={{ color: "red", paddingTop: "2px" }}>{errors.emailMessage}</small>}
                                </FormControl>
                                <FormControl>
                                    {/* <FormLabel htmlFor="password" sx={{
                                            textAlign: "start",
                                            fontSize: 15,
                                            padding: 1,
                                            color: "black"
                                        }}>Password</FormLabel> */}
                                    <Input id='phone_no' name='phone_no' type='text' placeholder='Phone No' autoComplete="phone_no" autoFocus required fullWidth
                                        sx={{
                                            textAlign: "start",
                                            fontSize: 15,
                                            padding: 1,
                                            color: "black"
                                        }}
                                        error={errors.phone}
                                        defaultValue={details.phone_no} />
                                    {!errors.phone ? "" : <small style={{ color: "red", paddingTop: "2px" }}>{errors.phoneMessage}</small>}
                                </FormControl>
                                <FormControl>
                                    {/* <FormLabel htmlFor="password" sx={{
                                            textAlign: "start",
                                            fontSize: 15,
                                            padding: 1,
                                            color: "black"
                                        }}>Password</FormLabel> */}
                                    <Input id='company' name='company' type='text' placeholder='Company' autoComplete="company" autoFocus required fullWidth
                                        sx={{
                                            textAlign: "start",
                                            fontSize: 15,
                                            padding: 1,
                                            color: "black"
                                        }}
                                        error={errors.company}
                                        defaultValue={details.company} />
                                </FormControl>
                                <FormControl>
                                    {/* <FormLabel htmlFor="password" sx={{
                                            textAlign: "start",
                                            fontSize: 15,
                                            padding: 1,
                                            color: "black"
                                        }}>Password</FormLabel> */}
                                    <Input id='job_title' name='job_title' type='text' placeholder='job_title' autoComplete="job_title" autoFocus required fullWidth
                                        sx={{
                                            textAlign: "start",
                                            fontSize: 15,
                                            padding: 1,
                                            color: "black"
                                        }}
                                        error={errors.job}
                                        defaultValue={details.job_title} />
                                </FormControl>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        backgroundColor: '#1976d2',
                                        '&:hover': {
                                            backgroundColor: '#1565c0',
                                        },
                                    }}
                                >
                                    {details.id ? "Update" : "Add"}
                                </Button>
                            </Box>

                        </Card>
                    </Fade>
                </Modal>

                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBlock: "4rem 0rem",
                    marginBottom: "2rem"
                }}>
                    <Typography variant="h4" component="h2" gutterBottom>
                        Contact List
                    </Typography>

                    <div style={{
                        display: "flex",
                        maxWidth: "30rem",
                        gap: 20,
                        height: "2.5rem"
                    }}>
                        <Input id="search" name='search' placeholder='search' type='text' defaultValue={search} style={{
                            width: "15rem"
                        }} onChange={e => setSearch(e.target.value)} />
                        <Button variant='contained' startIcon={<AddIcon />} style={{
                            width: "7rem"
                        }} onClick={handleOpen}> Add</Button>
                    </div>
                </div>

                <Paper elevation={6}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>S.No</StyledTableCell>
                                    <StyledTableCell>Name</StyledTableCell>
                                    <StyledTableCell>Email</StyledTableCell>
                                    <StyledTableCell>Phone</StyledTableCell>
                                    <StyledTableCell>Company</StyledTableCell>
                                    <StyledTableCell>Job-Title</StyledTableCell>
                                    <StyledTableCell>Action</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.length == 0 ? <StyledTableCell>No data Found</StyledTableCell> :
                                    (rowsPerPage > 0
                                    ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : rows).map((row, index) => (
                                        <StyledTableRow key={index}>
                                            <StyledTableCell>{index + 1}</StyledTableCell>
                                            <StyledTableCell scope="row">
                                                {row.firstname + ' ' + row.lastname}
                                            </StyledTableCell>
                                            <StyledTableCell>{row.email}</StyledTableCell>
                                            <StyledTableCell>{row.phone_no}</StyledTableCell>
                                            <StyledTableCell>{row.company}</StyledTableCell>
                                            <StyledTableCell>{row.job_title}</StyledTableCell>
                                            <StyledTableCell>
                                                <IconButton onClick={() => {
                                                    setDetails(row);
                                                    handleOpen()
                                                }} aria-label="upgrade">
                                                    <MovingTwoTone />
                                                </IconButton>{" "}
                                                <IconButton onClick={() => deleteContact(row.id)} aria-label="delete">
                                                    <DeleteOutlineTwoTone />
                                                </IconButton>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                </Paper>
            </Container>
        </React.Fragment>
    );
}
