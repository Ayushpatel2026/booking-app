import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";

export type HotelFormData = {
    name: string;
    description: string;
    city: string;
    country: string;
    type: string;
    starRating: number;
    pricePerNight: number;
    facilities: string[];
    imageFiles: FileList;
    adultCount: number;
    childCount: number;
}

type ManageHotelFormProps = {
    onSave: (hotelFormData: FormData) => void;
    isLoading: boolean;
}

const ManageHotelForm = ({onSave, isLoading}: ManageHotelFormProps) => {

    const formMethods = useForm<HotelFormData>();

    const { handleSubmit } = formMethods;

    const onSubmit = handleSubmit((formDataJSON : HotelFormData) => {
        // create new FormData object
        const formData = new FormData();
        formData.append("name", formDataJSON.name);
        formData.append("city", formDataJSON.city);
        formData.append("country", formDataJSON.country);
        formData.append("description", formDataJSON.description);
        formData.append("type", formDataJSON.type);
        formData.append("starRating", formDataJSON.starRating.toString());
        formData.append("pricePerNight", formDataJSON.pricePerNight.toString());
        formData.append("adultCount", formDataJSON.adultCount.toString());
        formData.append("childCount", formDataJSON.childCount.toString());
        
        // the backend knows to expect an array of strings for facilities
        // it will parse this into a list of strings
        formDataJSON.facilities.forEach((facility, index) => {
            formData.append(`facilities[${index}]`, facility);
        });

        // the multer middleware in the backend knows to expect an array of files for imageFiles
        Array.from(formDataJSON.imageFiles).forEach((imageFile) => {
            formData.append("imageFiles", imageFile);
        });

        onSave(formData);
    });

    return (
        <FormProvider {...formMethods}>
            <form className="flex flex-col gap-10" onSubmit={onSubmit}>
                <DetailsSection/>
                <TypeSection/>
                <FacilitiesSection/>
                <GuestsSection/>
                <ImagesSection/>
                <span className="flex justify-end">
                    <button 
                        disabled={isLoading}
                        type="submit" 
                        className="bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500"
                    >
                        {isLoading ? "Saving..." : "Save"}
                    </button>
                </span>
            </form>
        </FormProvider>
    )
}

export default ManageHotelForm;