import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useState } from "react";

// ✅ Firebase imports
import { db } from "../../config/firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function CompanyRegister() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [countryPhoneError, setCountryPhoneError] = useState(""); 
  const [logoFile, setLogoFile] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const onSubmit = async (data) => {
    if (!phone) {
      setPhoneError(true);
      return;
    }
    setPhoneError(false);

    const countryInput = data.country?.toLowerCase().trim();
    const phoneCountryName = selectedCountry?.name?.toLowerCase();

    if (countryInput && phoneCountryName && !phoneCountryName.includes(countryInput)) {
      setCountryPhoneError(`Phone number must match selected country (${data.country})`);
      return;
    } else {
      setCountryPhoneError(""); 
    }

    try {
      // ✅ Save data to Firestore
      await addDoc(collection(db, "companies"), {
        company_name: data.companyName,
        email: data.email,
        address: data.address,
        city: data.city,
        country: data.country,
        state: data.state,
        owner: data.owner,
        phone: phone,
        company_logo: logoFile ? logoFile.name : null, // 👈 abhi sirf file ka naam store ho raha hai
        website: data.website,
        created_at: serverTimestamp(),
      });

      toast.success("Company Registered Successfully!", {
        position: "top-center",
        autoClose: 3000,
      });

      reset();
      setPhone("");
      setLogoFile(null);
    } catch (error) {
      console.error("Error saving company:", error);
      toast.error("Failed to register company. Try again!");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-6"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1350&q=80')",
      }}
    >
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 italic">
          Company Registration
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Company Name */}
          <div>
            <input
              type="text"
              placeholder="Company Name"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none hover:shadow-md "
              {...register("companyName", { required: "Company Name is required" })}
            />
            {errors.companyName && (
              <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none hover:shadow-md"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /[^@\s]+@[^@\s]+\.[^@\s]+/, message: "Invalid email" },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Logo */}
          <div>
            <label className="flex items-center justify-between w-full p-3 border rounded-lg cursor-pointer text-gray-500 hover:shadow-md">
              <span className={logoFile ? "text-gray-900" : "text-gray-500"}>
                {logoFile ? logoFile.name : " Upload Company Logo"}
              </span>
              <span className="bg-purple-100 border text-black hover:text-white text-sm px-3 py-1 rounded-md hover:bg-purple-700">
                Choose File
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                {...register("logo", { required: "Logo is required" })}
                onChange={(e) => setLogoFile(e.target.files[0])}
              />
            </label>
            {errors.logo && (
              <p className="text-red-500 text-sm mt-1 ">{errors.logo.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <input
              type="text"
              placeholder="Address"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none hover:shadow-md"
              {...register("address", { required: "Address is required" })}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>

          {/* City */}
          <div>
            <input
              type="text"
              placeholder="City"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none hover:shadow-md"
              {...register("city", { required: "City is required" })}
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
            )}
          </div>

          {/* Country */}
          <div>
            <input
              type="text"
              placeholder="Country"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none hover:shadow-md"
              {...register("country", { required: "Country is required" })}
            />
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
            )}
          </div>

          {/* State */}
          <div>
            <input
              type="text"
              placeholder="State"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none hover:shadow-md"
              {...register("state", { required: "State is required" })}
            />
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
            )}
          </div>

          {/* Owner */}
          <div>
            <input
              type="text"
              placeholder="Owner Name"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none hover:shadow-md"
              {...register("owner", { required: "Owner name is required" })}
            />
            {errors.owner && (
              <p className="text-red-500 text-sm mt-1">{errors.owner.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <PhoneInput
              country={"us"}
              value={phone}
              onChange={(value, country) => {
                setPhone(value);
                setSelectedCountry(country);
              }}
              inputClass="!w-full !p-3 !pl-12 !border !rounded-lg !focus:ring-2 !focus:ring-purple-500 hover:shadow-md"
            />
            {phoneError && (
              <p className="text-red-500 text-sm mt-1">Phone number is required</p>
            )}
            {countryPhoneError && (
              <p className="text-red-500 text-sm mt-1">{countryPhoneError}</p>
            )}
          </div>

          {/* Website */}
          <div>
            <input
              type="url"
              placeholder="Website"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none hover:shadow-md"
              {...register("website", {
                required: "Website is required",
                pattern: {
                  value: /^(https?:\/\/)?([\w\-])+\.\w{2,}(\/\S*)?$/,
                  message: "Invalid website URL",
                },
              })}
            />
            {errors.website && (
              <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-purple-700 transition duration-300 shadow-md cursor-pointer italic"
          >
            Register Company
          </button>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
}
