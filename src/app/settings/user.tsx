import React from 'react';
import {Animated} from 'react-native';
import {Link, Navigator, Stack, Route} from '../../earhart';

import {View, Image, Text, ScrollView} from '../shared/tailwind';
import {Playlist} from '../profiles/playlist';
import {useUser} from '../../providers/user-provider';
import {api} from '../../services/api';
import {usePlaylistContext} from '../../providers/playlist-provider';

function User() {
  const user = useUser();
  return (
    <Navigator>
      <UserProfileInfo user={user} />
      <Stack>
        <Route path="/settings/user/profile">
          <UserProfile />
        </Route>
        <Route path="/settings/user/profile/playlist/:id">
          <Playlist backUrl="/settings/user/profile" />
        </Route>
      </Stack>
    </Navigator>
  );
}

function UserProfile({path}) {
  const user = useUser();

  const [state, dispatch] = usePlaylistContext();
  const [playlistIds, setPlaylistIds] = React.useState([]);

  React.useEffect(() => {
    api.get(`/users/${user.id}/playlists?public=true`).then(playlists => {
      dispatch({
        type: 'UPDATE_MANY',
        data: playlists,
      });

      setPlaylistIds(playlists.map(playlist => playlist.id));
    });
  }, [user.id]);

  const playlists = playlistIds
    .map(id => state.lookup[id])
    .filter(playlist => playlist.public);

  return (
    <View className="flex-1">
      <ScrollView className="flex-1">
        <View className="flex-1 p-4 bg-white">
          <Text className="text-2xl font-bold">Public Playlists</Text>
          <View style={{minHeight: 500}}>
            {playlists.map(playlist => {
              return <PlaylistRow key={playlist.id} playlist={playlist} />;
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function UserProfileInfo({user}) {
  return (
    <View className="mb-3 items-center">
      <Image
        style={{height: 120, width: 120, borderRadius: 60}}
        source={{uri: user.images[0].url}}
      />
      <Text className="mt-2 text-xl font-bold">{user.display_name}</Text>
    </View>
  );
}

function PlaylistRow({playlist}: {playlist: IPlaylist}) {
  return (
    <Link to={`playlist/${playlist.id}`}>
      <View className="my-4 flex-row">
        <Image
          className="mr-3 w-12 h-12 rounded-full"
          source={{uri: playlist.images[0]?.url}}
        />

        <View className="justify-center">
          <Text className="text-sm font-bold">{playlist.name}</Text>
          <Text className="mt-1 text-xs text-gray-600">0 followers</Text>
        </View>
      </View>
    </Link>
  );
}

export {User};
