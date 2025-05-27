import { CSSProperties } from "react"
import { PacmanLoader } from "react-spinners";

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
    color: '#0000'
};

function Spinner() {

    return (
        <PacmanLoader
        cssOverride={override}
        size={30}
        aria-label="Loading Spinner"
        data-testid="loader"
        />
    );
}

export default Spinner;