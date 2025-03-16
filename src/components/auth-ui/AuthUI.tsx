import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useIsDarkModeActive } from "../../hooks";
import supabaseClient from "../../lib/supabase";

const AuthUI = () => {
  const isDarkModeActive = useIsDarkModeActive();

  return (
    <div className="fixed w-1/2 xl:w-1/3 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
      <Auth
        supabaseClient={supabaseClient}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: isDarkModeActive ? "#232323" : "black",
                brandAccent: isDarkModeActive ? "#232323" : "black",
                inputLabelText: isDarkModeActive ? "#1A1A1A" : "#F6F6F6",
                defaultButtonBackgroundHover: isDarkModeActive ? "#23232390" : "#00000090",
              },
              radii: {
                borderRadiusButton: "1.5rem",
                inputBorderRadius: "1.5rem",
                buttonBorderRadius: "1.5rem",
              },
              space: {
                emailInputSpacing: "0px",
                labelBottomMargin: "0px",
              },
            },
          },
        }}
        theme={isDarkModeActive ? "dark" : "light"}
        providers={[]}
      />
    </div>
  );
};

export default AuthUI;
