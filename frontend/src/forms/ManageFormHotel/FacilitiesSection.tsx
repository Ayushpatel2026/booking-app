import { hotelFacilities  } from "../../config/hotel-options-config";
import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

const FacilitiesSection = () => {

    const { 
        register, 
        formState: {errors}
    } = useFormContext<HotelFormData>();

    return (
        <div>
            <h2 className="text-2xl mb-3 font-bold">
                Facilities
            </h2>

            <div className="grid grid-cols-5 gap-3">
                { hotelFacilities.map((facility) => (
                    <label className="text-sm flex gap-1 text-gray-700">
                        <input
                        type="checkbox" value={facility}
                        {...register("facilities", {
                            validate: (facilities) => {
                                if (facilities && facilities.length > 0) {
                                    return true;
                                }else{
                                    return "Select at least one facility";
                                }
                            },
                        })}
                        />
                        {facility}
                    </label>
                ))
                }
            </div>
            {errors.facilities && (<span className="text-red-500 text-sm font-bold">{errors.facilities.message}</span>)}
        </div>
    )
}

export default FacilitiesSection;