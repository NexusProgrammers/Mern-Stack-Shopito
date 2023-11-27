import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useSelector } from "react-redux";

const Headers = () => {
  const { carts } = useSelector((state) => state.carts);

  return (
    <>
      <Navbar style={{ height: "60px", background: "#00cccc", color: "white" }}>
        <Container>
          <NavLink to="/" className="text-decoration-none text-light mx-2">
            <h3 className="text-light">Shopito</h3>
          </NavLink>
          <NavLink to="/cart" className="text-decoration-none text-light mx-2">
            <div style={{ position: "relative" }}>
              <span>
                <MdOutlineShoppingCart size={60} />
              </span>
              <span
                style={{
                  top: 1,
                  left: "50px",
                  position: "absolute",
                  paddingTop: 1,
                  paddingLeft: 8,
                  paddingRight: 8,
                  backgroundColor: "blue",
                  borderRadius: "100%",
                }}
              >
                {carts.length}
              </span>
            </div>
          </NavLink>
        </Container>
      </Navbar>
    </>
  );
};

export default Headers;
