import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  // const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // if you add save logic

  useEffect(() => {
    const fetchUserAndCompany = async () => {
      try {
        // 1. Fetch user
        const userRef = doc(db, "users", id);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          console.log("User data:", userData);

          setUser(userData);

          // 2. Fetch company if cid exists
          if (userData.cid) {
            const companyRef = doc(db, "companies", userData.cid);
            const companySnap = await getDoc(companyRef);

            if (companySnap.exists()) {
              const companyData = companySnap.data();
              console.log("Company data:", companyData);
              setCompany(companyData);
            } else {
              console.log("No such company!");
            }
          }
        } else {
          console.log("No such user!");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUserAndCompany();
  }, [id]);

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{ backgroundColor: "#101828" }}
    >
      {/* Loader overlay */}
      {(loading || saving) && (
        <div className="absolute inset-0 backdrop-blur-xs flex flex-col items-center justify-center z-50">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-blue-400 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-blue-600 animate-[spin_2.5s_linear_infinite]"></div>
          </div>
          <p className="mt-4 text-gray-200 text-lg font-semibold">
            {saving ? "Saving..." : "Loading..."}
          </p>
        </div>
      )}

      {/* Glass Card */}
      <div className="bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-xl shadow-2xl p-6 border border-gray-700 w-full max-w-md text-gray-200 relative z-10">
        {user ? (
          <>
            <h2 className="text-3xl font-bold mb-4 text-white text-center">{user.name}</h2>
            <p className="mb-2">
              <strong>Email:</strong> {user.email}
            </p>

            {/* Company Info */}
            {company ? (
              <div className="mt-4">
                <p className="mb-2">
                  <strong>Company:</strong> {company.companyName}
                </p>
              </div>
            ) : (
              <p className="mb-2 text-gray-400">Company: Not assigned / Not found</p>
            )}
          </>
        ) : (
          !loading && <p className="text-red-400">User not found</p>
        )}
      </div>
    </div>
  );
}

export default UserDetail;
