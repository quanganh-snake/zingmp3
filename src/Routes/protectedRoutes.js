import { Route } from "react-router-dom";
import Profiles from "./../Pages/Profiles/Profiles";
import AuthMiddleware from "./../Middlewares/AuthMiddleware";

export const protectedRoutes = (
	<>
		<Route path="ca-nhan" element={<AuthMiddleware />}>
			<Route path="" element={<Profiles />} />
		</Route>
	</>
);
