// import { useState, useEffect } from "react";
// import { Outlet } from "react-router-dom";
// import Header from "./components/Header";
// import { useSnackbar } from "notistack";

// const CheckSession = () => {
//   const [user, setUser] = useState(null);
//   const { enqueueSnackbar } = useSnackbar();

//   useEffect(() => {
//     fetch("/check_session", {
//       credentials: "include",
//     })
//       .then((resp) => {
//         console.log("Session check data:", data);
//         if (resp.ok) {
//           resp.json().then(setUser);
//         } else {
//           resp.json().then((errorObj) => {
//             enqueueSnackbar(errorObj.message, { variant: "error" });
//           });
//         }
//       })
//       .catch((errorObj) => {
//         enqueueSnackbar(errorObj.message || "An error occurred", {
//           variant: "error",
//         });
//       });
//   }, [enqueueSnackbar]);

//   const updateUser = (newUser) => {
//     setUser(newUser);
//     // Optionally enqueue a snackbar message if needed
//     // enqueueSnackbar('User session updated', { variant: 'info' });
//   };

//   // The context is simplified since we're no longer using message and snackType
//   const ctx = { user, updateUser };

//   return (
//     <div>
//       <Header user={user} updateUser={updateUser} />
//       <div id="outlet">
//         <Outlet context={ctx} />
//       </div>
//     </div>
//   );
// };

// export default CheckSession;
