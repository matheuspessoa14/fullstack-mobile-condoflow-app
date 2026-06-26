import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { BRAND_COLORS } from "./src/assets/branding";
import { CondoBottomTab } from "./src/components/common/CondoBottomNav";
import { CallsScreen } from "./src/screens/CallsScreen";
import { CallsSyndicScreen } from "./src/screens/CallsSyndicScreen";
import { ChangePasswordScreen } from "./src/screens/ChangePasswordScreen";
import { CondoReservationsScreen } from "./src/screens/CondoReservationsScreen";
import { ContactScreen } from "./src/screens/ContactScreen";
import { FinanceResidentScreen } from "./src/screens/FinanceResidentScreen";
import { FinanceSyndicScreen } from "./src/screens/FinanceSyndicScreen";
import { ForgotPasswordScreen } from "./src/screens/ForgotPasswordScreen";
import { HelpSupportScreen } from "./src/screens/HelpSupportScreen";
import { HomeMoradorScreen } from "./src/screens/HomeMoradorScreen";
import { HomePorteiroScreen } from "./src/screens/HomePorteiroScreen";
import { HomeSindicoScreen } from "./src/screens/HomeSindicoScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { LogoutScreen } from "./src/screens/LogoutScreen";
import { NotificationCallDetailResidentScreen } from "./src/screens/NotificationCallDetailResidentScreen";
import { NotificationCallSyndicScreen } from "./src/screens/NotificationCallSyndicScreen";
import { NotificationDebtDetailScreen } from "./src/screens/NotificationDebtDetailScreen";
import { NotificationNewCallScreen } from "./src/screens/NotificationNewCallScreen";

import { NotificationPackageDetailScreen } from "./src/screens/NotificationPackageDetailScreen";
import { NotificationReservationConfirmScreen } from "./src/screens/NotificationReservationConfirmScreen";
import { NotificationResidentDetailScreen } from "./src/screens/NotificationResidentDetailScreen";
import { NotificationVisitDetailScreen } from "./src/screens/NotificationVisitDetailScreen";
import { NotificationsResidentScreen } from "./src/screens/NotificationsResidentScreen";
import { PackageConfirmationScreen } from "./src/screens/PackageConfirmationScreen";
import { PackageListingScreen } from "./src/screens/PackageListingScreen";
import { PackagesScreen } from "./src/screens/PackagesScreen";
import { RegisterPackageScreen } from "./src/screens/RegisterPackageScreen";
import { ProfileResidentScreen } from "./src/screens/ProfileResidentScreen";
import { RegisterResidentScreen } from "./src/screens/RegisterResidentScreen";
import { RegisterVisitorScreen } from "./src/screens/RegisterVisitorScreen";
import { ResidentListingScreen } from "./src/screens/ResidentListingScreen";
import { ResidentListingSyndicScreen } from "./src/screens/ResidentListingSyndicScreen";
import { RequestReservationScreen } from "./src/screens/RequestReservationScreen";
import { ReservationsScreen } from "./src/screens/ReservationsScreen";
import { SplashScreen } from "./src/screens/SplashScreen";
import { VisitorListingScreen } from "./src/screens/VisitorListingScreen";
import { VisitConfirmationScreen } from "./src/screens/VisitConfirmationScreen";

type HomeScreen = "homeMorador" | "homePorteiro" | "homeSindico";

type AppScreen =
  | "splash"
  | "login"
  | "forgotPassword"
  | HomeScreen
  | "helpSupport"
  | "contact"
  | "registerVisitor"
  | "visitConfirmation"
  | "packages"
  | "packageConfirmation"
  | "packageListing"
  | "registerPackage"
  | "financeResident"
  | "financeSyndic"
  | "residentListing"
  | "residentListingSyndic"
  | "registerResident"
  | "profileResident"
  | "visitorListing"
  | "reservations"
  | "condoReservations"
  | "requestReservation"
  | "changePassword"
  | "logout"
  | "callsSyndic"
  | "calls"
  | "notificationsResident"
  | "notifCallSyndic"
  | "notifReservationConfirm"
  | "notifDebtDetail"
  | "notifCallDetailResident"
  | "notifPackageDetail"
  | "notifResidentDetail"
  | "notifNewCall"
  | "notifNewNotice"
  | "notifVisitDetail";

type NotificationScreen =
  | "notifCallSyndic"
  | "notifReservationConfirm"
  | "notifDebtDetail"
  | "notifCallDetailResident"
  | "notifPackageDetail"
  | "notifResidentDetail"
  | "notifNewCall"
  | "notifNewNotice"
  | "notifVisitDetail";

export default function App() {
  const [homeScreen, setHomeScreen] = useState<HomeScreen>("homeMorador");
  const [helpSupportReturnScreen, setHelpSupportReturnScreen] =
    useState<AppScreen>("homeMorador");
  const [registerVisitorReturnScreen, setRegisterVisitorReturnScreen] =
    useState<AppScreen>("homeMorador");
  const [logoutReturnScreen, setLogoutReturnScreen] = useState<
    "changePassword" | "profileResident"
  >("profileResident");
  const [notificationReturnScreen, setNotificationReturnScreen] =
    useState<AppScreen>("notificationsResident");
  const [reservationReturnScreen, setReservationReturnScreen] = useState<
    "reservations" | "condoReservations"
  >("reservations");
  const [screen, setScreen] = useState<AppScreen>("splash");
  const isAuthScreen =
    screen === "splash" || screen === "login" || screen === "forgotPassword";
  const statusBarStyle = isAuthScreen ? "light" : "dark";

  const goHome = () => setScreen(homeScreen);

  const openRequestReservation = (
    origin: "reservations" | "condoReservations",
  ) => {
    setReservationReturnScreen(origin);
    setScreen("requestReservation");
  };

  const openLogout = (origin: "changePassword" | "profileResident") => {
    setLogoutReturnScreen(origin);
    setScreen("logout");
  };

  const openNotification = (target: NotificationScreen, origin: AppScreen) => {
    setNotificationReturnScreen(origin);
    setScreen(target);
  };

  const openHelpSupport = (origin: AppScreen) => {
    setHelpSupportReturnScreen(origin);
    setScreen("helpSupport");
  };

  const openRegisterVisitor = (origin: AppScreen) => {
    setRegisterVisitorReturnScreen(origin);
    setScreen("registerVisitor");
  };

  const handleBottomTabNavigation = (tab: CondoBottomTab) => {
    if (tab === "home") {
      goHome();
      return;
    }

    if (tab === "search") {
      setScreen("calls");
      return;
    }

    if (tab === "center") {
      openRegisterVisitor(screen);
      return;
    }

    if (tab === "notifications") {
      setScreen("notificationsResident");
      return;
    }

    if (tab === "profile") {
      setScreen("profileResident");
      return;
    }

    openHelpSupport(screen);
  };

  const renderScreen = () => {
    if (screen === "splash") {
      return <SplashScreen onEnter={() => setScreen("login")} />;
    }

    if (screen === "login") {
      return (
        <LoginScreen
          onLogin={(role) => {
            const nextHome: HomeScreen =
              role === "porteiro"
                ? "homePorteiro"
                : role === "sindico"
                  ? "homeSindico"
                  : "homeMorador";

            setHomeScreen(nextHome);
            setScreen(nextHome);
          }}
          onForgotPassword={() => setScreen("forgotPassword")}
        />
      );
    }

    if (screen === "forgotPassword") {
      return (
        <ForgotPasswordScreen
          onBack={() => setScreen("login")}
          onSubmit={() => setScreen("login")}
        />
      );
    }

    if (screen === "homeMorador") {
      return (
        <HomeMoradorScreen
          onOpenReservations={() => setScreen("reservations")}
          onOpenCalls={() => setScreen("calls")}
          onOpenVisitorRegistration={() => openRegisterVisitor("homeMorador")}
          onOpenPackages={() => setScreen("packageListing")}
          onOpenFinance={() => setScreen("financeResident")}
          onOpenNotifications={() => setScreen("notificationsResident")}
          onOpenSyndicHome={() => {
            setHomeScreen("homeSindico");
            setScreen("homeSindico");
          }}
          onPressTab={handleBottomTabNavigation}
        />
      );
    }

    if (screen === "homePorteiro") {
      return (
        <HomePorteiroScreen
          onOpenCalls={() => setScreen("calls")}
          onOpenVisitorRegistration={() => setScreen("visitorListing")}
          onOpenPackages={() => setScreen("packageListing")}
          onOpenNotifications={() => setScreen("notificationsResident")}
          onOpenResidentListing={() => setScreen("residentListing")}
          onOpenSyndicHome={() => {
            setHomeScreen("homeSindico");
            setScreen("homeSindico");
          }}
          onPressTab={handleBottomTabNavigation}
        />
      );
    }

    if (screen === "homeSindico") {
      return (
        <HomeSindicoScreen
          onOpenReservations={() => setScreen("condoReservations")}
          onOpenCalls={() => setScreen("callsSyndic")}
          onOpenNewNotice={() =>
            openNotification("notifNewNotice", "homeSindico")
          }
          onOpenVisitorRegistration={() => setScreen("visitorListing")}
          onOpenPackages={() => setScreen("packageListing")}
          onOpenFinance={() => setScreen("financeSyndic")}
          onOpenNotifications={() => setScreen("notificationsResident")}
          onOpenResidentListingSyndic={() => setScreen("residentListingSyndic")}
          onOpenMoradorHome={() => {
            setHomeScreen("homeMorador");
            setScreen("homeMorador");
          }}
          onPressTab={handleBottomTabNavigation}
        />
      );
    }

    if (screen === "helpSupport") {
      return (
        <HelpSupportScreen
          onGoBack={() => setScreen(helpSupportReturnScreen)}
          onOpenContact={() => setScreen("contact")}
          onPressTab={handleBottomTabNavigation}
        />
      );
    }

    if (screen === "contact") {
      return (
        <ContactScreen
          onGoBack={() => setScreen("helpSupport")}
          onOpenFaq={() => setScreen("helpSupport")}
          onPressTab={handleBottomTabNavigation}
        />
      );
    }

    if (screen === "registerVisitor") {
      return (
        <RegisterVisitorScreen
          onGoBack={() => setScreen(registerVisitorReturnScreen)}
          onConfirmVisit={() => setScreen("visitConfirmation")}
          onPressTab={handleBottomTabNavigation}
        />
      );
    }

    if (screen === "visitConfirmation") {
      return (
        <VisitConfirmationScreen
          onExit={() => setScreen(registerVisitorReturnScreen)}
        />
      );
    }

    if (screen === "packages") {
      return (
        <PackagesScreen
          onGoBack={goHome}
          onOpenPackageConfirmation={() => setScreen("packageConfirmation")}
          onPressTab={handleBottomTabNavigation}
        />
      );
    }

    if (screen === "packageConfirmation") {
      return (
        <PackageConfirmationScreen onExit={() => setScreen("packageListing")} />
      );
    }

    if (screen === "packageListing") {
      return (
        <PackageListingScreen
          onGoBack={goHome}
          onRegisterPackage={() => setScreen("registerPackage")}
          onOpenPackageDetails={() =>
            openNotification("notifPackageDetail", "packageListing")
          }
          onPressTab={handleBottomTabNavigation}
        />
      );
    }

    if (screen === "registerPackage") {
      return (
        <RegisterPackageScreen
          onGoBack={() => setScreen("packageListing")}
          onConfirmPackage={() => setScreen("packageConfirmation")}
          onPressTab={handleBottomTabNavigation}
        />
      );
    }

    if (screen === "residentListingSyndic") {
      return (
        <ResidentListingSyndicScreen
          onGoBack={goHome}
          onRegisterResident={() => setScreen("registerResident")}
          onOpenResidentDetails={() =>
            openNotification("notifResidentDetail", "residentListingSyndic")
          }
          onPressTab={handleBottomTabNavigation}
        />
      );
    }

    if (screen === "registerResident") {
      return (
        <RegisterResidentScreen
          onGoBack={() => setScreen("residentListingSyndic")}
          onPressTab={handleBottomTabNavigation}
        />
      );
    }

    if (screen === "residentListing") {
      return (
        <ResidentListingScreen
          onGoBack={goHome}
          onOpenResidentDetails={() =>
            openNotification("notifResidentDetail", "residentListing")
          }
          onPressTab={handleBottomTabNavigation}
        />
      );
    }

    if (screen === "visitorListing") {
      return (
        <VisitorListingScreen
          onGoBack={goHome}
          onReleaseVisit={() => openRegisterVisitor("visitorListing")}
          onOpenVisitorDetails={() =>
            openNotification("notifVisitDetail", "visitorListing")
          }
          onPressTab={handleBottomTabNavigation}
        />
      );
    }

    if (screen === "reservations") {
      return (
        <ReservationsScreen
          onGoBack={goHome}
          onOpenRequestReservation={() =>
            openRequestReservation("reservations")
          }
          onPressTab={handleBottomTabNavigation}
        />
      );
    }

    if (screen === "condoReservations") {
      return (
        <CondoReservationsScreen
          onGoBack={goHome}
          onOpenRequestReservation={() =>
            openRequestReservation("condoReservations")
          }
          onOpenResidentRequestDetails={() =>
            openNotification("notifReservationConfirm", "condoReservations")
          }
          onPressTab={handleBottomTabNavigation}
        />
      );
    }

    if (screen === "requestReservation") {
      return (
        <RequestReservationScreen
          onGoBack={() => setScreen(reservationReturnScreen)}
          onConfirmReservation={() => setScreen(reservationReturnScreen)}
          onPressTab={handleBottomTabNavigation}
        />
      );
    }

    if (screen === "changePassword") {
      return (
        <ChangePasswordScreen
          onGoBack={() => setScreen("profileResident")}
          onOpenLogout={() => openLogout("changePassword")}
          onPressTab={handleBottomTabNavigation}
        />
      );
    }

    if (screen === "profileResident") {
      return (
        <ProfileResidentScreen
          onGoBack={goHome}
          onOpenChangePassword={() => setScreen("changePassword")}
          onOpenSupport={() => openHelpSupport("profileResident")}
          onOpenLogout={() => openLogout("profileResident")}
          onPressTab={handleBottomTabNavigation}
        />
      );
    }

    if (screen === "logout") {
      return (
        <LogoutScreen
          onConfirm={() => setScreen("login")}
          onCancel={() => setScreen(logoutReturnScreen)}
        />
      );
    }

    if (screen === "financeResident") {
      return (
        <FinanceResidentScreen
          onGoBack={goHome}
          onPressTab={handleBottomTabNavigation}
        />
      );
    }

    if (screen === "financeSyndic") {
      return (
        <FinanceSyndicScreen
          onGoBack={goHome}
          onOpenDefaultResidentDetails={() =>
            openNotification("notifDebtDetail", "financeSyndic")
          }
          onPressTab={handleBottomTabNavigation}
        />
      );
    }

    if (screen === "callsSyndic") {
      return (
        <CallsSyndicScreen
          onGoBack={goHome}
          onOpenCallDetails={() =>
            openNotification("notifCallSyndic", "callsSyndic")
          }
          onPressTab={handleBottomTabNavigation}
        />
      );
    }

    if (screen === "calls") {
      return (
        <CallsScreen
          onGoBack={goHome}
          onOpenNewCall={() => openNotification("notifNewCall", "calls")}
          onOpenCallDetails={() =>
            openNotification("notifCallDetailResident", "calls")
          }
          onPressTab={handleBottomTabNavigation}
        />
      );
    }

    if (screen === "notificationsResident") {
      return (
        <NotificationsResidentScreen
          onGoBack={goHome}
          onOpenNewNotice={() =>
            openNotification("notifNewNotice", "notificationsResident")
          }
          onOpenReservationConfirm={() =>
            openNotification("notifReservationConfirm", "notificationsResident")
          }
          onOpenDebtDetail={() =>
            openNotification("notifDebtDetail", "notificationsResident")
          }
          onOpenCallSyndic={() =>
            openNotification("notifCallSyndic", "notificationsResident")
          }
          onOpenCallDetail={() =>
            openNotification("notifCallDetailResident", "notificationsResident")
          }
          onPressTab={handleBottomTabNavigation}
        />
      );
    }

    if (screen === "notifCallSyndic") {
      return (
        <NotificationCallSyndicScreen
          onConfirm={() => setScreen(notificationReturnScreen)}
          onCancel={() => setScreen(notificationReturnScreen)}
          onDismiss={() => setScreen(notificationReturnScreen)}
        />
      );
    }

    if (screen === "notifReservationConfirm") {
      return (
        <NotificationReservationConfirmScreen
          onConfirm={() => setScreen(notificationReturnScreen)}
          onCancel={() => setScreen(notificationReturnScreen)}
          onDismiss={() => setScreen(notificationReturnScreen)}
        />
      );
    }

    if (screen === "notifDebtDetail") {
      return (
        <NotificationDebtDetailScreen
          onExit={() => setScreen(notificationReturnScreen)}
          onDismiss={() => setScreen(notificationReturnScreen)}
        />
      );
    }

    if (screen === "notifCallDetailResident") {
      return (
        <NotificationCallDetailResidentScreen
          onDismiss={() => setScreen(notificationReturnScreen)}
        />
      );
    }

    if (screen === "notifPackageDetail") {
      return (
        <NotificationPackageDetailScreen
          onConfirm={() => setScreen(notificationReturnScreen)}
          onCancel={() => setScreen(notificationReturnScreen)}
          onDismiss={() => setScreen(notificationReturnScreen)}
        />
      );
    }

    if (screen === "notifResidentDetail") {
      return (
        <NotificationResidentDetailScreen
          onDismiss={() => setScreen(notificationReturnScreen)}
        />
      );
    }

    if (screen === "notifNewCall") {
      return (
        <NotificationNewCallScreen
          onConfirm={() => setScreen(notificationReturnScreen)}
          onCancel={() => setScreen(notificationReturnScreen)}
          onDismiss={() => setScreen(notificationReturnScreen)}
        />
      );
    }

    if (screen === "notifNewNotice") {
      return (
        <NotificationNewNoticeScreen
          onConfirm={() => setScreen(notificationReturnScreen)}
          onCancel={() => setScreen(notificationReturnScreen)}
          onDismiss={() => setScreen(notificationReturnScreen)}
        />
      );
    }

    if (screen === "notifVisitDetail") {
      return (
        <NotificationVisitDetailScreen
          onConfirm={() => setScreen(notificationReturnScreen)}
          onCancel={() => setScreen(notificationReturnScreen)}
          onDismiss={() => setScreen(notificationReturnScreen)}
        />
      );
    }

    return <SplashScreen onEnter={() => setScreen("login")} />;
  };

  return (
    <SafeAreaView style={[styles.safeArea, isAuthScreen && styles.authArea]}>
      <StatusBar style={statusBarStyle} />
      {renderScreen()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BRAND_COLORS.background,
  },
  authArea: {
    backgroundColor: BRAND_COLORS.primaryLight,
  },
});
