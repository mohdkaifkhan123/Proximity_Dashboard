import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const createPaymentIntent = createAsyncThunk(
  "payment/createPaymentIntent",
  async ({ userId, amount,planId }, { rejectWithValue }) => {
    console.log("userIIII",userId,amount)
    try {
      const response = await fetch("http://localhost:5000/pay/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount,planId }),
      });
         
      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const data = await response.json();
      console.log("data",data)
      return data.clientSecret; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    clientSecret: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetPaymentState: (state) => {
      state.clientSecret = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.clientSecret = action.payload;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
