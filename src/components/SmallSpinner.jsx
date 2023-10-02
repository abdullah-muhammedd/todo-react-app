import { BallTriangle } from "react-loader-spinner";

export default function SmallSpinner() {
    return (<>
        <div className="flex justify-center items-center">
            <BallTriangle
                height={50}
                width={50}
                radius={5}
                color="#facc15"
                ariaLabel="ball-triangle-loading"
                wrapperClass={{}}
                wrapperStyle=""
                visible={true}
            />
        </div>
    </>)
}