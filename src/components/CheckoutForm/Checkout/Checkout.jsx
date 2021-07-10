import React,{ useState, useEffect } from 'react'
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline} from '@material-ui/core';
import useStyles from './styles';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import { commerce } from '../../../lib/commerce'
import { Link, useHistory } from 'react-router-dom'

const steps = ['Shipping Address','Payment Details'];

const Checkout = ({cart, order, onCaptureCheckout, error}) => {
    const [activeStep, setactiveStep] = useState(0);
    const [checkoutToken, setcheckoutToken] = useState()
    const [shippingData, setshippingData] = useState({})
    const classes = useStyles();
    const history = useHistory();
    useEffect(() => {
        const generateToken = async () => {
            try{
                const token = await commerce.checkout.generateToken(cart.id, { type:'cart'})
                setcheckoutToken(token)
            }catch(error){
                history.pushState('/')
            }
        }
        generateToken()
    }, [cart])

    const nextStep = () => setactiveStep((prevActiveStep) => prevActiveStep+1);
    const backStep = () => setactiveStep((prevActiveStep) => prevActiveStep-1);

    const next = (data) => {
        setshippingData(data)
        nextStep()
    }
    console.log(order);
    let Confirmation = () => order.customer ? (
        <>
            <div>
                <Typography variant="h5">
                    Thank you from your purchase, {order.customer.firstname} {order.customer.lastname}
                </Typography>
                <Divider className={classes.divider}/>
                <Typography variant="subtitle2">Order ref: {order.customer_reference}</Typography>
            </div>
            <br/>
            <Button variant="outlined" component={Link} to="/" type="button">Back to Home</Button>
        </>
    ) : (
        <div className={classes.spinner}>
            <CircularProgress/>
        </div>
    )

    if(error){
        <>
            <Typography variant="h5">
                   Error: {error}
            </Typography>
            <br/>
            <Button variant="outlined" component={Link} to="/" type="button">Back to Home</Button>
        </>
    }

    const Form = () => activeStep === 0 
    ? <AddressForm checkoutToken={checkoutToken} next={next}/> 
    : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} backStep={backStep} onCaptureCheckout={onCaptureCheckout} nextStep={nextStep}/>


    return (
        <>
        <CssBaseline />
            <div className={classes.toolbar}>
                <main className={classes.layout}>
                    <Paper className={classes.paper}>
                        <Typography variant="h4" align="center">Checkout</Typography>
                        <Stepper activeStep={activeStep} className={classes.stepper}>
                           {steps.map((step) => (
                               <Step key={step}> 
                                    <StepLabel>{step}</StepLabel>
                               </Step>
                           ))} 
                        </Stepper>
                        {activeStep === steps.length ? <Confirmation/> : checkoutToken && <Form/>}
                    </Paper>
                </main>
            </div>   
        </>
    )
}

export default Checkout
