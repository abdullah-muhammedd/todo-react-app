import { BallTriangle } from "react-loader-spinner";

export default function LoadingSpinner() {
    return (<>
        <div className="flex justify-center items-center h-screen">
            <BallTriangle
                height={200}
                width={200}
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