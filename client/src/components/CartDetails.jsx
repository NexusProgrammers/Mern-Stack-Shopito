import { useDispatch, useSelector } from "react-redux";
import "../components/CartStyles.css";
import { toast } from "react-hot-toast";
import {
  addToCart,
  emptycartIteam,
  removeSingleIteams,
  removeToCart,
} from "../redux/cartSlice";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const CartDetails = () => {
  const dispatch = useDispatch();

  const { carts } = useSelector((state) => state.carts);

  const [totalprice, setPrice] = useState(0);
  const [totalquantity, setTotalQuantity] = useState(0);

  const handleIncrement = (e) => {
    dispatch(addToCart(e));
  };

  const handleDecrement = (e) => {
    dispatch(removeToCart(e));
    toast.success("Item Remove From Your Cart");
  };

  const handleSingleDecrement = (e) => {
    dispatch(removeSingleIteams(e));
  };

  const emptycart = () => {
    dispatch(emptycartIteam());
    toast.success("Your Cart is Empty");
  };

  useEffect(() => {
    const total = () => {
      let totalprice = 0;
      carts.map((ele) => {
        totalprice = ele.price * ele.qnty + totalprice;
      });
      setPrice(totalprice);
    };

    total();
  }, [carts]);

  useEffect(() => {
    const countquantity = () => {
      let totalquantity = 0;
      carts.map((ele) => {
        totalquantity = ele.qnty + totalquantity;
      });
      setTotalQuantity(totalquantity);
    };

    countquantity();
  }, [carts]);

  const makePayment = async () => {
    const stripe = await loadStripe(
      "pk_test_51M40OtGkBLzTuQRGjoslBMwJgrwHUIK8WtNY6Mcvr6WIfljbB6kR2KbM31HY1d83kQnCet8ZsWvPWvG23IYQE56S007l7ggJrV"
    );

    const body = {
      products: carts,
    };

    const headers = {
      "Content-Type": "application/json",
    };
    const response = await fetch(
      "https://mern-stack-shopito-server.vercel.app/api/create-checkout-session",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );

    const session = await response.json();

    const result = stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.log(result.error);
    }
  };

  return (
    <>
      <div className="row justify-content-center m-0">
        <div className="col-md-8 mt-5 mb-5 cardsdetails">
          <div className="card">
            <div className="card-header bg-info p-3">
              <div className="card-header-flex">
                <h5 className="text-white m-0">
                  Cart Calculation {carts.length > 0 ? `(${carts.length})` : ""}
                </h5>
                {carts.length > 0 ? (
                  <button
                    className="btn btn-danger mt-0 btn-sm"
                    onClick={emptycart}
                  >
                    <i className="fa fa-trash-alt mr-2"></i>
                    <span>Empty Cart</span>
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="card-body p-0">
              {carts.length === 0 ? (
                <table className="table cart-table mb-0">
                  <tbody>
                    <tr>
                      <td colSpan={6}>
                        <div className="cart-empty">
                          <i className="fa fa-shopping-cart"></i>
                          <p>Your Cart Is Empty</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <table className="table cart-table mb-0 table-responsive-sm">
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>Product</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th className="text-right">
                        {" "}
                        <span id="amount" className="amount">
                          Total Amount
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {carts.map((data, index) => {
                      return (
                        <>
                          <tr key={index}>
                            <td>
                              <button
                                className="prdct-delete"
                                onClick={() => handleDecrement(data.id)}
                              >
                                <i className="fa fa-trash-alt"></i>
                              </button>
                            </td>
                            <td>
                              <div className="product-img">
                                <img src={data.imgdata} alt="" />
                              </div>
                            </td>
                            <td>
                              <div className="product-name">
                                <p>{data.dish}</p>
                              </div>
                            </td>
                            <td>{data.price}</td>
                            <td>
                              <div className="prdct-qty-container">
                                <button
                                  className="prdct-qty-btn"
                                  type="button"
                                  onClick={
                                    data.qnty <= 1
                                      ? () => handleDecrement(data.id)
                                      : () => handleSingleDecrement(data)
                                  }
                                >
                                  <i className="fa fa-minus"></i>
                                </button>
                                <input
                                  type="text"
                                  className="qty-input-box"
                                  value={data.qnty}
                                  disabled
                                  name=""
                                  id=""
                                />
                                <button
                                  className="prdct-qty-btn"
                                  type="button"
                                  onClick={() => handleIncrement(data)}
                                >
                                  <i className="fa fa-plus"></i>
                                </button>
                              </div>
                            </td>
                            <td className="text-right">
                              <span className="fw-bold">
                                $ {data.qnty * data.price}
                              </span>
                            </td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th>&nbsp;</th>
                      <th colSpan={2}>&nbsp;</th>
                      <th>
                        Items In Cart <span className="ml-2 mr-2">:</span>
                        <span className="text-danger">{totalquantity}</span>
                      </th>
                      <th className="text-right">
                        Total Price<span className="ml-2 mr-2">:</span>
                        <span className="text-danger">₹ {totalprice}</span>
                      </th>
                      <th className="text-right">
                        <button
                          onClick={makePayment}
                          className="btn btn-success"
                          type="button"
                        >
                          Check out
                        </button>
                      </th>
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDetails;
