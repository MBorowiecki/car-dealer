import ProgressBar from "@ramonak/react-progress-bar";
import { NextPage } from "next";

import { ICarCard } from "./types";

const CarCard: NextPage<ICarCard> = ({
    carManufacturer,
    car,
    carEngine,
    maxEnginePower,
    buttons
}) => {
    return (
        <div className="row row-hcenter">
            <div className="col-3">
                <div>
                    <p className="size-xs weight-normal color-light_1">
                        {carManufacturer.name}
                    </p>
                </div>
            </div>
            <div className="col-9">
                <div className="mb-1 full-width">
                    <span className="size-m color-light_1 weight-semibold">
                        {car.model}
                    </span>

                    <span className="align-right">
                        <span className="color-money_1 size-l mr-1">$</span>
                        <span className="color-light_1 size-xxl weight-semibold line-through mr-1">{car.productionPrice}</span>
                        <span className="color-light_1 size-xxl weight-semibold">0</span>
                    </span>
                </div>
                <div className="row row-hcenter mb-1">
                    <div className="col-6 pl-1 pr-1 mb-3">
                        <div className="mb-1">
                            <p className="size-m color-light_2 align-center">
                                HP
                            </p>
                        </div>

                        <ProgressBar completed={carEngine.power} maxCompleted={maxEnginePower} customLabel={carEngine.power.toString()} baseBgColor="#002945" height="8px" />
                    </div>
                    <div className="col-6 pl-1 pr-1 mb-3">
                        <div className="mb-1">
                            <p className="size-m color-light_2 align-center">
                                BODY
                            </p>
                        </div>

                        <ProgressBar completed={car.bodyCondition} maxCompleted={100} customLabel={car.bodyCondition.toString()} baseBgColor="#002945" height="8px" />
                    </div>
                    <div className="col-6 pl-1 pr-1 mb-3">
                        <div className="mb-1">
                            <p className="size-m color-light_2 align-center">
                                INTERIOR
                            </p>
                        </div>

                        <ProgressBar completed={car.interiorCondition} maxCompleted={100} customLabel={car.interiorCondition.toString()} baseBgColor="#002945" height="8px" />
                    </div>
                    <div className="col-6 pl-1 pr-1">
                        <div className="mb-1">
                            <p className="size-m color-light_2 align-center">
                                SUSPENSION
                            </p>
                        </div>

                        <ProgressBar completed={car.suspensionCondition} maxCompleted={100} customLabel={car.suspensionCondition.toString()} baseBgColor="#002945" height="8px" />
                    </div>
                </div>
            </div>
            <div className="row row-vcenter row-hcenter">
                <div className={`col-auto ${buttons && "mr-2"}`}>
                    <span className="color-money_1 size-l mr-1">$</span>
                    <span className="color-light_1 size-xxl weight-semibold line-through mr-1">{car.productionPrice}</span>
                    <span className="color-light_1 size-xxl weight-semibold">0</span>
                </div>

                {buttons &&
                    <div className="col-auto">
                        {buttons}
                    </div>
                }
            </div>
        </div>
    )
}

export default CarCard;