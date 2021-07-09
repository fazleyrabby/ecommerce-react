import React,{ useState,useEffect } from 'react'
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core'
import { useForm, FormProvider } from 'react-hook-form'
import FormInput from './FormInput'
import { commerce } from '../../lib/commerce'
import { Link } from 'react-router-dom'
import { method } from 'bluebird'
const AddressForm = ({ checkoutToken }) => {
    const [shippingCountries, setshippingCountries] = useState([])
    const [shippingCountry, setshippingCountry] = useState('')
    const [shippingSubdivisions, setshippingSubdivisions] = useState([])
    const [shippingSubdivision, setshippingSubdivision] = useState('')
    const [shippingOptions, setshippingOptions] = useState([])
    const [shippingOption, setshippingOption] = useState('')
    const methods = useForm()

    const countries = Object.entries(shippingCountries).map(([code, name]) => ({id: code, label: name}))
     
    const subdivisions = Object.entries(shippingSubdivisions).map(([code, name]) => ({id: code, label: name}))

    const options = shippingOptions.map((sO) => ({id:sO.id, label: `${sO.description} - ${sO.price.formatted_with_symbol}`}))

    const fetchShippingCountries = async (checkoutTokenId) => {
        const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId)
        setshippingCountries(countries)
        setshippingCountry(Object.keys(countries)[0])
    }
 
    const fetchSubdivisions = async (countryCode) => {
        const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode)
        setshippingSubdivisions(subdivisions)
        setshippingSubdivision(Object.keys(subdivisions)[0])
    }

    const fetchShippingOptions = async (checkoutTokenId, country, region = null) => {
        const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region })
        setshippingOptions(options)
        setshippingOption(options[0].id)
    }

    useEffect(() => {
        fetchShippingCountries(checkoutToken.id)
    }, []);

    useEffect(() => {
        if(shippingCountry) fetchSubdivisions(shippingCountry)
    }, [shippingCountry]);


    useEffect(() => {
        if(shippingSubdivision) fetchShippingOptions(checkoutToken.id,shippingCountry, shippingSubdivision)
    }, [shippingSubdivision]);

    return (
        <>
            <Typography variant="h6" gutterBottom>Shipping Address</Typography>
            <FormProvider {...methods}>
                {/* <form onSubmit={method.handleSubmit((data)=> )}> */}
                <form onSubmit=''>
                    <Grid container spacing={3}>
                        <FormInput required name='firstname' label='First Name'/>
                        <FormInput required name='lastname' label='Last Name'/>
                        <FormInput required name='address1' label='Address'/>
                        <FormInput required name='email' label='Email'/>
                        <FormInput required name='city' label='City'/>
                        <FormInput required name='zip' label='Zip / Postal Code'/>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Country</InputLabel>
                            <Select value={shippingCountry} 
                            fullWidth 
                            onChange={(e)=> setshippingCountry(e.target.value)}>
                                {countries.map((country) => (
                                    <MenuItem key={country.id} value={country.id}>{country.label}</MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Sub division</InputLabel>
                            <Select value={shippingSubdivision} 
                            fullWidth  
                            onChange={(e)=> setshippingSubdivision(e.target.value)}>
                                {subdivisions.map((subdivision) => (
                                    <MenuItem key={subdivision.id} value={subdivision.id}>{subdivision.label}</MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Options</InputLabel>
                            <Select value={shippingOption} fullWidth  
                            onChange={(e)=> setshippingOption(e.target.value)}>
                                {options.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>{option.label}</MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                </form>
                <br />
                <div style={{ display:'flex',justifyContent:'space-between' }}>
                    <Button component={Link} to="/cart" variant="outlined">Back to Cart</Button>
                    <Button type="submit" variant="contained" color="primary">Next</Button>
                </div>
            </FormProvider>
        </>
    )
}

export default AddressForm
