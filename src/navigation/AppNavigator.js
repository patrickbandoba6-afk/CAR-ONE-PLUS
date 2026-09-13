import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { navigationRef } from './navigationRef';
import { useAppState } from '../context/AppStateContext';
import { PROFESSIONAL_SCREENS, BACKOFFICE_SCREENS, PREMIUM_SCREENS } from './stubScreens';

// Public / auth
import SplashScreen from '../screens/public/SplashScreen';
import OnboardingScreen from '../screens/public/OnboardingScreen';
import AccountTypeScreen from '../screens/public/AccountTypeScreen';
import SignupScreen from '../screens/public/SignupScreen';
import LoginScreen from '../screens/public/LoginScreen';
import IdentityVerificationScreen from '../screens/public/IdentityVerificationScreen';
import HomeScreen from '../screens/public/HomeScreen';
import SearchScreen from '../screens/public/SearchScreen';
import FiltersScreen from '../screens/public/FiltersScreen';
import ResultsScreen from '../screens/public/ResultsScreen';
import MapScreen from '../screens/public/MapScreen';
import VehicleDetailScreen from '../screens/public/VehicleDetailScreen';
import GalleryScreen from '../screens/public/GalleryScreen';
import PriceDetailsScreen from '../screens/public/PriceDetailsScreen';
import OptionsScreen from '../screens/public/OptionsScreen';
import PaymentScreen from '../screens/public/PaymentScreen';
import ConfirmationScreen from '../screens/public/ConfirmationScreen';
import FavoritesScreen from '../screens/public/FavoritesScreen';

// Location (cycle de réservation — vécu côté locataire, donc Particulier)
import BookingsListScreen from '../screens/location/BookingsListScreen';
import BookingDetailScreen from '../screens/location/BookingDetailScreen';
import InstructionsScreen from '../screens/location/InstructionsScreen';
import DigitalAccessScreen from '../screens/location/DigitalAccessScreen';
import CheckInOutScreen from '../screens/location/CheckInOutScreen';
import ActiveRentalScreen from '../screens/location/ActiveRentalScreen';
import TripMapScreen from '../screens/location/TripMapScreen';
import AssistanceScreen from '../screens/location/AssistanceScreen';
import AddDamageScreen from '../screens/location/AddDamageScreen';
import IncidentScreen from '../screens/location/IncidentScreen';
import InvoiceScreen from '../screens/location/InvoiceScreen';
import ReviewScreen from '../screens/location/ReviewScreen';

// Propriétaire / flotte — exclusivement Professionnel (voir mission
// "séparation des espaces" : mettre un bien en location n'existe que côté pro).
import OwnerDashboardScreen from '../screens/owner/OwnerDashboardScreen';
import MyVehiclesScreen from '../screens/owner/MyVehiclesScreen';
import AddVehicleScreen from '../screens/owner/AddVehicleScreen';
import VehicleSettingsScreen from '../screens/owner/VehicleSettingsScreen';
import OwnerBookingsScreen from '../screens/owner/OwnerBookingsScreen';
import RequesterProfileScreen from '../screens/owner/RequesterProfileScreen';
import EarningsScreen from '../screens/owner/EarningsScreen';
import PayoutsScreen from '../screens/owner/PayoutsScreen';
import MaintenanceScreen from '../screens/owner/MaintenanceScreen';
import ClaimsScreen from '../screens/owner/ClaimsScreen';
import StatsScreen from '../screens/owner/StatsScreen';

// Compte — écrans communs aux deux espaces (chacun monté dans son propre
// stack ci-dessous ; ce sont deux instances distinctes du même composant,
// pas une route partagée entre les espaces).
import AccountScreen from '../screens/account/AccountScreen';
import ProfileScreen from '../screens/account/ProfileScreen';
import AccountInfoScreen from '../screens/account/AccountInfoScreen';
import LoyaltyScreen from '../screens/account/LoyaltyScreen';
import ContractScreen from '../screens/account/ContractScreen';
import ContractsListScreen from '../screens/account/ContractsListScreen';

// Professionnel
import ProDashboardScreen from '../screens/professional/ProDashboardScreen';
import FleetScreen from '../screens/professional/FleetScreen';
import ProBookingsScreen from '../screens/professional/ProBookingsScreen';
import CollaboratorsScreen from '../screens/professional/CollaboratorsScreen';
import AccountingScreen from '../screens/professional/AccountingScreen';
import ReportingScreen from '../screens/professional/ReportingScreen';
import InspectionsScreen from '../screens/professional/InspectionsScreen';

import ScreenStub from '../components/ScreenStub';

const AuthStack = createNativeStackNavigator();
const ParticulierStack = createNativeStackNavigator();
const ProfessionnelStack = createNativeStackNavigator();
const ParticulierTab = createBottomTabNavigator();
const ProfessionnelTab = createBottomTabNavigator();

const screenOptions = { headerShown: false };

function tabBarOptions(tabs) {
  return {
    headerShown: false,
    tabBarActiveTintColor: colors.gold,
    tabBarInactiveTintColor: colors.textMuted,
    tabBarStyle: { backgroundColor: colors.bgElevated, borderTopColor: colors.cardBorder, height: 60, paddingBottom: 8, paddingTop: 6 },
    tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
  };
}

// ============================================================
// ESPACE PARTICULIER — louer uniquement. Aucune route de cette
// arborescence ne permet de publier/gérer un bien (voir mission).
// ============================================================
const PARTICULIER_TABS = [
  { name: 'HomeTab', label: 'Accueil', icon: 'home', component: HomeScreen },
  { name: 'SearchTab', label: 'Rechercher', icon: 'search', component: SearchScreen },
  { name: 'BookingsTab', label: 'Réservations', icon: 'calendar', component: BookingsListScreen },
  { name: 'FavoritesTab', label: 'Favoris', icon: 'heart', component: FavoritesScreen },
  { name: 'AccountTab', label: 'Profil', icon: 'person', component: AccountScreen },
];

function ParticulierTabs() {
  return (
    <ParticulierTab.Navigator
      screenOptions={({ route }) => {
        const tab = PARTICULIER_TABS.find((t) => t.name === route.name);
        return { ...tabBarOptions(PARTICULIER_TABS), tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? tab.icon : `${tab.icon}-outline`} size={22} color={color} />
        ) };
      }}
    >
      {PARTICULIER_TABS.map((t) => (
        <ParticulierTab.Screen key={t.name} name={t.name} component={t.component} options={{ tabBarLabel: t.label }} />
      ))}
    </ParticulierTab.Navigator>
  );
}

function ParticulierNavigator() {
  const { pendingIdentityVerification } = useAppState();
  return (
    <ParticulierStack.Navigator screenOptions={screenOptions} initialRouteName={pendingIdentityVerification ? 'IdentityVerification' : 'MainTabs'}>
      <ParticulierStack.Screen name="IdentityVerification" component={IdentityVerificationScreen} />
      <ParticulierStack.Screen name="MainTabs" component={ParticulierTabs} />

      <ParticulierStack.Screen name="Search" component={SearchScreen} />
      <ParticulierStack.Screen name="Filters" component={FiltersScreen} />
      <ParticulierStack.Screen name="Results" component={ResultsScreen} />
      <ParticulierStack.Screen name="Map" component={MapScreen} />
      <ParticulierStack.Screen name="VehicleDetail" component={VehicleDetailScreen} />
      <ParticulierStack.Screen name="Gallery" component={GalleryScreen} />
      <ParticulierStack.Screen name="PriceDetails" component={PriceDetailsScreen} />
      <ParticulierStack.Screen name="Options" component={OptionsScreen} />
      <ParticulierStack.Screen name="Payment" component={PaymentScreen} />
      <ParticulierStack.Screen name="Confirmation" component={ConfirmationScreen} />

      <ParticulierStack.Screen name="BookingDetail" component={BookingDetailScreen} />
      <ParticulierStack.Screen name="Instructions" component={InstructionsScreen} />
      <ParticulierStack.Screen name="DigitalAccess" component={DigitalAccessScreen} />
      <ParticulierStack.Screen name="CheckIn" component={CheckInOutScreen} />
      <ParticulierStack.Screen name="CheckOut" component={CheckInOutScreen} />
      <ParticulierStack.Screen name="ActiveRental" component={ActiveRentalScreen} />
      <ParticulierStack.Screen name="TripMap" component={TripMapScreen} />
      <ParticulierStack.Screen name="Assistance" component={AssistanceScreen} />
      <ParticulierStack.Screen name="AddDamage" component={AddDamageScreen} />
      <ParticulierStack.Screen name="Incident" component={IncidentScreen} />
      <ParticulierStack.Screen name="Invoice" component={InvoiceScreen} />
      <ParticulierStack.Screen name="Review" component={ReviewScreen} />

      <ParticulierStack.Screen name="Profile" component={ProfileScreen} />
      <ParticulierStack.Screen name="Loyalty" component={LoyaltyScreen} />
      <ParticulierStack.Screen name="Contract" component={ContractScreen} />
      <ParticulierStack.Screen name="Contracts" component={ContractsListScreen} />
      <ParticulierStack.Screen name="Drivers" component={AccountInfoScreen} />
      <ParticulierStack.Screen name="AccountDocuments" component={AccountInfoScreen} />
      <ParticulierStack.Screen name="Payments" component={AccountInfoScreen} />
      <ParticulierStack.Screen name="Notifications" component={AccountInfoScreen} />
      <ParticulierStack.Screen name="Privacy" component={AccountInfoScreen} />
      <ParticulierStack.Screen name="Security" component={AccountInfoScreen} />
      <ParticulierStack.Screen name="Help" component={AccountInfoScreen} />
      <ParticulierStack.Screen name="Terms" component={AccountInfoScreen} />

      {PREMIUM_SCREENS.map((s) => (
        <ParticulierStack.Screen key={s.name} name={s.name} component={ScreenStub} initialParams={{ title: s.title, icon: s.icon, phase: s.phase }} />
      ))}
    </ParticulierStack.Navigator>
  );
}

// ============================================================
// ESPACE PROFESSIONNEL — seul chemin pour publier/gérer un bien
// en location (véhicule, flotte, yacht, aéronef...). Aucune route
// de cette arborescence ne mène au parcours locataire particulier.
// ============================================================
const PROFESSIONNEL_TABS = [
  { name: 'DashboardTab', label: 'Dashboard', icon: 'grid', component: ProDashboardScreen },
  { name: 'FleetTab', label: 'Flotte', icon: 'car-sport', component: FleetScreen },
  { name: 'ReservationsTab', label: 'Réservations', icon: 'calendar', component: ProBookingsScreen },
  { name: 'AccountTab', label: 'Profil', icon: 'person', component: AccountScreen },
];

function ProfessionnelTabs() {
  return (
    <ProfessionnelTab.Navigator
      screenOptions={({ route }) => {
        const tab = PROFESSIONNEL_TABS.find((t) => t.name === route.name);
        return { ...tabBarOptions(PROFESSIONNEL_TABS), tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? tab.icon : `${tab.icon}-outline`} size={22} color={color} />
        ) };
      }}
    >
      {PROFESSIONNEL_TABS.map((t) => (
        <ProfessionnelTab.Screen key={t.name} name={t.name} component={t.component} options={{ tabBarLabel: t.label }} />
      ))}
    </ProfessionnelTab.Navigator>
  );
}

function ProfessionnelNavigator() {
  const { pendingIdentityVerification } = useAppState();
  return (
    <ProfessionnelStack.Navigator screenOptions={screenOptions} initialRouteName={pendingIdentityVerification ? 'IdentityVerification' : 'MainTabs'}>
      <ProfessionnelStack.Screen name="IdentityVerification" component={IdentityVerificationScreen} />
      <ProfessionnelStack.Screen name="MainTabs" component={ProfessionnelTabs} />

      <ProfessionnelStack.Screen name="ProDashboard" component={ProDashboardScreen} />
      <ProfessionnelStack.Screen name="Fleet" component={FleetScreen} />
      <ProfessionnelStack.Screen name="ProBookings" component={ProBookingsScreen} />
      <ProfessionnelStack.Screen name="Collaborators" component={CollaboratorsScreen} />
      <ProfessionnelStack.Screen name="Accounting" component={AccountingScreen} />
      <ProfessionnelStack.Screen name="Reporting" component={ReportingScreen} />
      <ProfessionnelStack.Screen name="AddVehicle" component={AddVehicleScreen} />
      <ProfessionnelStack.Screen name="OwnerDashboard" component={OwnerDashboardScreen} />
      <ProfessionnelStack.Screen name="MyVehicles" component={MyVehiclesScreen} />
      <ProfessionnelStack.Screen name="Documents" component={VehicleSettingsScreen} />
      <ProfessionnelStack.Screen name="Photos" component={VehicleSettingsScreen} />
      <ProfessionnelStack.Screen name="Pricing" component={VehicleSettingsScreen} />
      <ProfessionnelStack.Screen name="Calendar" component={VehicleSettingsScreen} />
      <ProfessionnelStack.Screen name="Rules" component={VehicleSettingsScreen} />
      <ProfessionnelStack.Screen name="AccessMode" component={VehicleSettingsScreen} />
      <ProfessionnelStack.Screen name="OwnerBookings" component={OwnerBookingsScreen} />
      <ProfessionnelStack.Screen name="RequesterProfile" component={RequesterProfileScreen} />
      <ProfessionnelStack.Screen name="Earnings" component={EarningsScreen} />
      <ProfessionnelStack.Screen name="Payouts" component={PayoutsScreen} />
      <ProfessionnelStack.Screen name="Maintenance" component={MaintenanceScreen} />
      <ProfessionnelStack.Screen name="Claims" component={ClaimsScreen} />
      <ProfessionnelStack.Screen name="Stats" component={StatsScreen} />
      <ProfessionnelStack.Screen name="Inspections" component={InspectionsScreen} />

      <ProfessionnelStack.Screen name="Profile" component={ProfileScreen} />
      <ProfessionnelStack.Screen name="Loyalty" component={LoyaltyScreen} />
      <ProfessionnelStack.Screen name="Contract" component={ContractScreen} />
      <ProfessionnelStack.Screen name="Contracts" component={ContractsListScreen} />
      <ProfessionnelStack.Screen name="Drivers" component={AccountInfoScreen} />
      <ProfessionnelStack.Screen name="AccountDocuments" component={AccountInfoScreen} />
      <ProfessionnelStack.Screen name="Payments" component={AccountInfoScreen} />
      <ProfessionnelStack.Screen name="Notifications" component={AccountInfoScreen} />
      <ProfessionnelStack.Screen name="Privacy" component={AccountInfoScreen} />
      <ProfessionnelStack.Screen name="Security" component={AccountInfoScreen} />
      <ProfessionnelStack.Screen name="Help" component={AccountInfoScreen} />
      <ProfessionnelStack.Screen name="Terms" component={AccountInfoScreen} />

      {[...PROFESSIONAL_SCREENS, ...BACKOFFICE_SCREENS].map((s) => (
        <ProfessionnelStack.Screen key={s.name} name={s.name} component={ScreenStub} initialParams={{ title: s.title, icon: s.icon, phase: s.phase }} />
      ))}
    </ProfessionnelStack.Navigator>
  );
}

// ============================================================
// ESPACE AUTH — non connecté. Seul point d'entrée commun ; c'est le
// seul endroit où le choix Particulier/Professionnel existe, et
// uniquement pour créer un NOUVEAU compte (voir AccountTypeScreen).
// ============================================================
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={screenOptions} initialRouteName="Splash">
      <AuthStack.Screen name="Splash" component={SplashScreen} />
      <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
      <AuthStack.Screen name="AccountType" component={AccountTypeScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
}

// ============================================================
// Switch racine — la SEULE décision de routage de haut niveau.
// authStatus/accountType viennent de la session restaurée (ou du
// profil relu à l'inscription/connexion), jamais d'un choix libre en
// navigation. Trois arborescences mutuellement exclusives : à tout
// instant, une seule est montée, donc les routes de l'autre espace
// n'existent tout simplement pas dans l'arbre React actif — un
// navigate() vers une route de l'autre espace échoue silencieusement,
// ce n'est pas un bouton caché, c'est une route absente.
// ============================================================
export default function AppNavigator() {
  const { authStatus, accountType } = useAppState();

  let content;
  if (authStatus === 'loading') {
    content = (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.gold} />
      </View>
    );
  } else if (authStatus !== 'signedIn') {
    content = <AuthNavigator />;
  } else if (accountType === 'professional') {
    content = <ProfessionnelNavigator />;
  } else {
    content = <ParticulierNavigator />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      {content}
    </NavigationContainer>
  );
}
