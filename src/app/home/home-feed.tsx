import React from 'react';
import {Link} from '../../earhart';
import {View, Text, ScrollView, Image, SafeAreaView} from '../shared/tailwind';
import {api} from '../../services/api';
import {usePlaylists, useCollections} from '../../providers/spotify-providers';

function HomeFeed() {
  return (
    <View className="flex flex-1 bg-white">
      <SafeAreaView />
      <SettingsHeader />

      <ScrollView className="py-4 bg-white">
        <Playlists feedId="featured" title="Editors Picks" />
        <Playlists feedId="toplists" title="Top" />
        <Playlists feedId="workout" title="Workout" />
        <Playlists feedId="party" title="Party" />
      </ScrollView>
    </View>
  );
}

interface IPlaylists {
  feedId: string;
  title: string;
}

function Playlists({feedId, title}: IPlaylists) {
  const playlists = useFeedPlaylists(feedId);

  return (
    <View className="py-3">
      <Text className="px-4 text-3xl font-bold">{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {playlists.map((playlist) => {
          if (!playlist) {
            return null;
          }

          return (
            <View className="p-3" key={playlist.id}>
              <Link to={`/home/playlists/${playlist.id}`}>
                <Image
                  source={{uri: playlist.images[0].url}}
                  style={{height: 150, width: 150}}
                />

                <Text className="py-2 text-sm">{playlist.name}</Text>
              </Link>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function SettingsHeader() {
  return (
    <View className="py-4 px-3 flex-row">
      <View className="flex-1" />
      <Link to={`/home/settings`}>
        <Text className="text-2xl font-semibold text-right">Settings</Text>
      </Link>
    </View>
  );
}

function useFeedPlaylists(feedId: string) {
  const update = usePlaylists((state) => state.update);
  const lookup = usePlaylists((state) => state.lookup);

  const add = useCollections((state) => state.update);

  React.useEffect(() => {
    if (feedId) {
      api.get(`/playlists/${feedId}`).then((playlists) => {
        update(playlists);
        const playlistIds = playlists.map((p) => p.id);

        const collection = {
          id: feedId,
          ids: playlistIds,
        };

        add([collection]);
      });
    }
  }, [feedId]);

  const playlistIds = useCollections(
    (state) => state.lookup[feedId]?.ids || [],
  );
  
  return playlistIds.map((id) => lookup[id]);
}

export {HomeFeed};
