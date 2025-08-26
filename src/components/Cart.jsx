import { useDispatch, useSelector } from "react-redux";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { increaseAmount, reduceAmount, deleteProduct, resetTheCart, switchDelivery, setDelivery } from "../redux/cartSlice";
import homeDeliveryIcon from '../assets/15309871.gif';

import Avatar from '@mui/joy/Avatar';
import Checkbox, { checkboxClasses } from '@mui/joy/Checkbox';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect } from "react";

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

  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const Cart = () => {
  const cartList = useSelector(state => state.cart.cartList);
  const totalPrice = useSelector(state => state.cart.totalPrice);
  const delivery = useSelector(state => state.cart.delivery);

  const dispatch = useDispatch();

  useEffect(() => {
    if (cartList.length === 0) {
      dispatch(setDelivery(false));
    }
  }, [cartList, dispatch]);


  const [open, setOpen] = React.useState(false);
  const confirmTheOrder = () => {
    setOpen(false);
    dispatch(setDelivery(false));
    dispatch(resetTheCart());
  }

  return (
    <>
      <h4 style={{ marginBottom: '40px', color: '#2E8B8B', fontSize: '30px' }}><b>My Shopping Cart</b></h4>
      <br />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell style={{ textAlign: 'center' }}>Product</StyledTableCell>
              <StyledTableCell align="right">Price</StyledTableCell>
              <StyledTableCell align="right">Amount</StyledTableCell>
              <StyledTableCell align="right">Subtotal</StyledTableCell>
              <StyledTableCell align="right">Delete</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cartList.length > 0 && cartList.map((product, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="row">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    style={{ height: '90px', width: '90px' }}
                  />
                  {product.title}
                </StyledTableCell>
                <StyledTableCell align="right">{product.price} ₪</StyledTableCell>
                <StyledTableCell align="right">
                  <button onClick={() => dispatch(increaseAmount(product))}><b>+</b></button>
                  {product.amount}
                  <button disabled={product.amount === 1} onClick={() => dispatch(reduceAmount(product))}><b>-</b></button>
                </StyledTableCell>
                <StyledTableCell align="right">{(product.amount * product.price).toFixed(2)} ₪</StyledTableCell>
                <StyledTableCell align="right">
                  <IconButton sx={{
                    '&:hover': {
                      color: 'red'
                    }
                  }} aria-label="delete" onClick={() => dispatch(deleteProduct(product))}>
                    <DeleteIcon />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <br />
      {cartList.length === 0 &&
        <div>
          <h5><b>Nothing here yet.</b></h5>
          <p>Browse our products and find something you’ll love!</p>
        </div>}

      <br />
      <h4 style={{ marginTop: '50px' }}>
        Total Price: {totalPrice < 0.01 && totalPrice > -0.01 ? "0.00" : totalPrice.toFixed(2)} ₪
      </h4>

      <Sheet
        sx={{ p: 2, borderRadius: 'sm', width: 400, maxWidth: '100%', margin: '0 auto' }}
      >
        <div role="group" aria-labelledby="member">
          <List
            sx={{
              '--ListItem-gap': '0.75rem',
              [`& .${checkboxClasses.root}`]: {
                mr: 'auto',
                flexGrow: 1,
                alignItems: 'center',
                flexDirection: 'row-reverse',
              },
            }}
          >
            <ListItem
              {...(delivery && {
                variant: 'soft',
                color: 'primary',
              })}
            >

              <Avatar aria-hidden="true" src={homeDeliveryIcon} style={{ height: '95px', width: '95px' }} />
              <Checkbox
                disabled={cartList.length === 0}
                overlay
                label={
                  <React.Fragment>
                    <h5><b> Home Delivery  35₪{' '}</b></h5>
                    {delivery && (
                      <Typography
                        aria-hidden="true"
                        sx={{ display: 'block', fontSize: 'sm', color: 'neutral.500' }}
                      >
                        The order request has been accepted.
                      </Typography>
                    )}
                  </React.Fragment>
                }
                checked={delivery}
                onChange={() => dispatch(switchDelivery())}
                sx={{ color: 'inherit' }}
              />
            </ListItem>
          </List>

        </div>
      </Sheet>

      <React.Fragment>
        <Button variant="outlined" color="neutral" disabled={cartList.length === 0} onClick={() => setOpen(true)} style={{ height: '55px', width: '190px', fontSize: '19px' }}>
          <b>For payment and order</b>
        </Button>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog
            aria-labelledby="nested-modal-title"
            aria-describedby="nested-modal-description"
            sx={(theme) => ({
              [theme.breakpoints.only('xs')]: {
                top: 'unset',
                bottom: 0,
                left: 0,
                right: 0,
                borderRadius: 0,
                transform: 'none',
                maxWidth: 'unset',
              },
            })}
          >
            <Typography id="nested-modal-title" level="h2">
              Do you want to complete the order?
            </Typography>
            <Box
              sx={{
                mt: 1,
                display: 'flex',
                gap: 1,
                flexDirection: { xs: 'column', sm: 'row-reverse' },
              }}
            >
              <Button variant="solid" color="primary" onClick={() => confirmTheOrder()}>
                Confirm
              </Button>
              <Button
                variant="outlined"
                color="neutral"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </Box>
          </ModalDialog>
        </Modal>
      </React.Fragment>
    </>
  )
}

export default Cart;