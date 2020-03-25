import React from 'react';
import {
  Stack,
  Switch,
  Route,
  Navigator,
  Link,
  NativeStack,
} from '../../earhart';
import {
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  Pressable,
} from '../shared/tailwind';
import {useAuth} from '../../providers/auth-provider';
import {User} from './user';
import {Playback} from './playback';
import {Notifications} from './notifications';
import {useUser} from '../../providers/user-provider';

import {Animated} from 'react-native';

function Settings({}) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Navigator>
        <NativeStack>
          <Route path="/home/settings">
            <SettingsHeader title="Settings" back="/home" />
            <Index />
          </Route>
          <Route path="/home/settings/*">
            <Profiles />
          </Route>
        </NativeStack>
      </Navigator>
    </SafeAreaView>
  );
}

function Profiles() {
  return (
    <Navigator initialIndex={-1}>
      <Switch>
        <Route path="/home/settings/notifications">
          <SettingsHeader title="Notifications" back="/home/settings" />
          <Notifications />
        </Route>
        <Route path="/home/settings/playback">
          <SettingsHeader title="Playback" back="/home/settings" />
          <Playback />
        </Route>

        <Route path="/home/settings/profile">
          <SettingsHeader title="Settings" back="/home/settings" />
          <User />
        </Route>
      </Switch>
    </Navigator>
  );
}

function Index() {
  const user = useUser();

  return (
    <ScrollView className="flex-1 pb-12 px-4">
      <Link to="/home/settings/profile">
        <UserRow user={user} />
      </Link>

      <SettingsLink to="/home/settings/playback" title="Playback" />
      <SettingsLink to="/home/settings/notifications" title="Notifications" />

      <Logout />
    </ScrollView>
  );
}

function SettingsHeader({title, back}) {
  return (
    <View className="py-2 px-4 bg-white justify-center">
      <View>
        <Text className="text-3xl font-bold text-center">{title}</Text>

        <View className="absolute left-0">
          <Link to={back}>
            <Text className="text-xl font-semibold text-center">Back</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}

interface ISettingsLink {
  to: string;
  title: string;
}

function SettingsLink({to, title}: ISettingsLink) {
  return (
    <Link to={`${to}`}>
      <View className="mb-8 py-2 flex-row justify-between">
        <Text className="text-xl font-semibold">{title}</Text>
        <Text className="text-xl font-semibold">→</Text>
      </View>
    </Link>
  );
}

interface IUserRow {
  user: IUser;
}

function UserRow({user}: IUserRow) {
  return (
    <View className="flex-row mb-12 mt-8">
      <Image
        style={{height: 80, width: 80, borderRadius: 40}}
        source={{uri: user?.images[0].url}}
      />

      <View className="ml-4 justify-center">
        <Text className="text-2xl font-semibold">{user?.display_name}</Text>
        <Text className="text-lg font-medium mt-2">View Profile</Text>
      </View>
    </View>
  );
}

function Logout() {
  const {logout} = useAuth();

  return (
    <View style={{marginTop: 40, alignItems: 'center'}}>
      <Pressable
        className="px-6 py-3 border"
        onPress={logout}
        style={{
          borderRadius: 40,
        }}>
        <Text
          className="text-lg font-medium uppercase"
          style={{
            letterSpacing: 1.5,
          }}>
          Log Out
        </Text>
      </Pressable>
    </View>
  );
}

export {Settings};
