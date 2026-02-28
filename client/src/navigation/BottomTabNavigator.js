import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

import HomeScreen from "../screens/HomeScreen"
import UsersListScreen from "../screens/UsersListScreen"
import AdminsListScreen from "../screens/AdminsListScreen"
import Header from "../components/Header"
import ProfileScreen from "../screens/ProfileScreen"
import { useAuth } from "../context/AuthContext"

const Tab = createBottomTabNavigator()


export default function BottomTabNavigator(){
    const { user } = useAuth()
    return (
        <Tab.Navigator
            screenOptions={({route,navigation})=>({
                header: ()=>(
                    <Header
                    title={route.name}
                    navigation={navigation}
                    />
                ),
                tabBarIcon:({focused,color,size})=>{
                    let iconName
                    if(route.name === "Home"){
                        iconName = focused ? "home" : "home-outline"
                    }
                    else if(route.name === "Users"){
                        iconName = focused ? "account-group" : "account-group-outline"
                    }
                    else if(route.name === "Admins"){
                        iconName = focused ? "shield-account" : "shield-account-outline"
                    }
                    else if(route.name === "Profile"){
                        iconName = focused ? "account-circle" : "account-circle-outline"
                    }
                    return <Icon name={iconName} size={size} color="#4c6ef5" />
                }
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />

            {(user?.role === "admin" || user?.role === "superadmin") && (
                <Tab.Screen name="Users" component={UsersListScreen} />
            )}
            {(user?.role === "superadmin") && (
                <Tab.Screen name="Admins" component={AdminsListScreen} />
            )}
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    )
}