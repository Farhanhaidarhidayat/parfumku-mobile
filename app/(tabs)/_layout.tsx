import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#8A4E2A",
        tabBarInactiveTintColor: "#8E7E76",
        sceneStyle: { backgroundColor: "#F8F3ED" },
        tabBarStyle: {
          height: 70,
          paddingTop: 8,
          paddingBottom: 8,
          backgroundColor: "#FFFDF9",
          borderTopWidth: 1,
          borderTopColor: "#E8DDD2",
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "800" },
        tabBarItemStyle: { borderRadius: 14 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome name="home" size={focused ? 21 : 19} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: "Love",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome name="heart" size={focused ? 20 : 18} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome name="shopping-cart" size={focused ? 21 : 19} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "Histori",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome name="history" size={focused ? 20 : 18} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome name="user" size={focused ? 21 : 19} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
