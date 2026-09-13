import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors } from '../theme/colors';
import { navigationRef } from './navigationRef';
import { useAppState } from '../context/AppStateContext';
import { ALL_STUB_SCREENS } from './stubScreens';

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

// Location (cycle de réservation)
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

// Propriétaire
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

// Compte
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

import ScreenStub from '../components/ScreenStub';

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const RENTER_TABS = [
  { name: 'HomeTab', label: 'Accueil', icon: 'home', component: HomeScreen },
  { name: 'SearchTab', label: 'Rechercher', icon: 'search', component: SearchScreen },
  { name: 'BookingsTab', label: 'Mes réservations', icon: 'calendar', component: BookingsListScreen },
  { name: 'FavoritesTab', label: 'Favoris', icon: 'heart', component: FavoritesScreen },
  { name: 'AccountTab', label: 'Mon compte', icon: 'person', component: AccountScreen },
];

const OWNER_TABS = [
  { name: 'OwnerTab', label: 'Dashboard', icon: 'grid', component: OwnerDashboardScreen },
  { name: 'MyVehiclesTab', label: 'Mes biens', icon: 'car-sport', component: MyVehiclesScreen },
  { name: 'OwnerBookingsTab', label: 'Réservations', icon: 'calendar', component: OwnerBookingsScreen },
  { name: 'EarningsTab', label: 'Revenus', icon: 'trending-up', component: EarningsScreen },
  { name: 'AccountTab2', label: 'Mon compte', icon: 'person', component: AccountScreen },
];

// Espace professionnel — distinct du parcours particulier (renter/owner) :
// pas de bascule vers ces tabs sans un compte accountType==='professional'
// vérifié (voir SideMenu.js, IdentityVerificationScreen.js).
const PRO_TABS = [
  { name: 'ProDashboardTab', label: 'Dashboard', icon: 'grid', component: ProDashboardScreen },
  { name: 'ProFleetTab', label: 'Flotte', icon: 'car-sport', component: FleetScreen },
  { name: 'ProBookingsTab', label: 'Réservations', icon: 'calendar', component: ProBookingsScreen },
  { name: 'AccountTab3', label: 'Mon compte', icon: 'person', component: AccountScreen },
];

function MainTabs() {
  const { mode } = useAppState();
  const tabs = mode === 'professional' ? PRO_TABS : mode === 'owner' ? OWNER_TABS : RENTER_TABS;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const tab = tabs.find((t) => t.name === route.name);
        return {
          headerShown: false,
          tabBarActiveTintColor: colors.gold,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: { backgroundColor: colors.bgElevated, borderTopColor: colors.cardBorder, height: 60, paddingBottom: 8, paddingTop: 6 },
          tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? tab.icon : `${tab.icon}-outline`} size={22} color={color} />
          ),
        };
      }}
    >
      {tabs.map((t) => (
        <Tab.Screen key={t.name} name={t.name} component={t.component} initialParams={t.initialParams} options={{ tabBarLabel: t.label }} />
      ))}
    </Tab.Navigator>
  );
}

const screenOptions = { headerShown: false };

export default function AppNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator screenOptions={screenOptions} initialRouteName="Splash">
        <RootStack.Screen name="Splash" component={SplashScreen} />
        <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
        <RootStack.Screen name="AccountType" component={AccountTypeScreen} />
        <RootStack.Screen name="Signup" component={SignupScreen} />
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen name="IdentityVerification" component={IdentityVerificationScreen} />

        <RootStack.Screen name="MainTabs" component={MainTabs} />

        <RootStack.Screen name="Search" component={SearchScreen} />
        <RootStack.Screen name="Filters" component={FiltersScreen} />
        <RootStack.Screen name="Results" component={ResultsScreen} />
        <RootStack.Screen name="Map" component={MapScreen} />
        <RootStack.Screen name="VehicleDetail" component={VehicleDetailScreen} />
        <RootStack.Screen name="Gallery" component={GalleryScreen} />
        <RootStack.Screen name="PriceDetails" component={PriceDetailsScreen} />
        <RootStack.Screen name="Options" component={OptionsScreen} />
        <RootStack.Screen name="Payment" component={PaymentScreen} />
        <RootStack.Screen name="Confirmation" component={ConfirmationScreen} />

        <RootStack.Screen name="BookingDetail" component={BookingDetailScreen} />
        <RootStack.Screen name="Instructions" component={InstructionsScreen} />
        <RootStack.Screen name="DigitalAccess" component={DigitalAccessScreen} />
        <RootStack.Screen name="CheckIn" component={CheckInOutScreen} />
        <RootStack.Screen name="CheckOut" component={CheckInOutScreen} />
        <RootStack.Screen name="ActiveRental" component={ActiveRentalScreen} />
        <RootStack.Screen name="TripMap" component={TripMapScreen} />
        <RootStack.Screen name="Assistance" component={AssistanceScreen} />
        <RootStack.Screen name="AddDamage" component={AddDamageScreen} />
        <RootStack.Screen name="Incident" component={IncidentScreen} />
        <RootStack.Screen name="Invoice" component={InvoiceScreen} />
        <RootStack.Screen name="Review" component={ReviewScreen} />

        <RootStack.Screen name="ProDashboard" component={ProDashboardScreen} />
        <RootStack.Screen name="Fleet" component={FleetScreen} />
        <RootStack.Screen name="ProBookings" component={ProBookingsScreen} />
        <RootStack.Screen name="Collaborators" component={CollaboratorsScreen} />
        <RootStack.Screen name="Accounting" component={AccountingScreen} />
        <RootStack.Screen name="Reporting" component={ReportingScreen} />
        <RootStack.Screen name="AddVehicle" component={AddVehicleScreen} />
        <RootStack.Screen name="OwnerDashboard" component={OwnerDashboardScreen} />
        <RootStack.Screen name="MyVehicles" component={MyVehiclesScreen} />
        <RootStack.Screen name="Documents" component={VehicleSettingsScreen} />
        <RootStack.Screen name="Photos" component={VehicleSettingsScreen} />
        <RootStack.Screen name="Pricing" component={VehicleSettingsScreen} />
        <RootStack.Screen name="Calendar" component={VehicleSettingsScreen} />
        <RootStack.Screen name="Rules" component={VehicleSettingsScreen} />
        <RootStack.Screen name="AccessMode" component={VehicleSettingsScreen} />
        <RootStack.Screen name="OwnerBookings" component={OwnerBookingsScreen} />
        <RootStack.Screen name="RequesterProfile" component={RequesterProfileScreen} />
        <RootStack.Screen name="Earnings" component={EarningsScreen} />
        <RootStack.Screen name="Payouts" component={PayoutsScreen} />
        <RootStack.Screen name="Maintenance" component={MaintenanceScreen} />
        <RootStack.Screen name="Claims" component={ClaimsScreen} />
        <RootStack.Screen name="Stats" component={StatsScreen} />

        <RootStack.Screen name="Profile" component={ProfileScreen} />
        <RootStack.Screen name="Loyalty" component={LoyaltyScreen} />
        <RootStack.Screen name="Contract" component={ContractScreen} />
        <RootStack.Screen name="Contracts" component={ContractsListScreen} />
        <RootStack.Screen name="Drivers" component={AccountInfoScreen} />
        <RootStack.Screen name="AccountDocuments" component={AccountInfoScreen} />
        <RootStack.Screen name="Payments" component={AccountInfoScreen} />
        <RootStack.Screen name="Notifications" component={AccountInfoScreen} />
        <RootStack.Screen name="Privacy" component={AccountInfoScreen} />
        <RootStack.Screen name="Security" component={AccountInfoScreen} />
        <RootStack.Screen name="Help" component={AccountInfoScreen} />
        <RootStack.Screen name="Terms" component={AccountInfoScreen} />

        {ALL_STUB_SCREENS.map((s) => (
          <RootStack.Screen key={s.name} name={s.name} component={ScreenStub} initialParams={{ title: s.title, icon: s.icon, phase: s.phase }} />
        ))}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
