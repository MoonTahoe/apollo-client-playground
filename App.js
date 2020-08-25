import React from "react";
import { InMemoryCache, gql, makeVar, ApolloClient } from "@apollo/client";
import { ApolloProvider, useQuery } from "@apollo/react-hooks";
import { Button, Text, View, SafeAreaView } from "react-native";

//
// Web Browser Version of this Sample: https://codesandbox.io/s/quiet-bash-pi2ms?file=/src/App.js:0-1247
//

const position = makeVar(14);
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        position: {
          read() {
            return position();
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  cache,
});

const POSITION_QUERY = gql`
  query {
    position @client
  }
`;

function Position() {
  const { loading, error, data } = useQuery(POSITION_QUERY);
  if (loading) return <Text>loading...</Text>;
  if (error) return <Text>{JSON.stringify(error, null, 2)}</Text>;
  return <Text>{data.position}</Text>;
}

function PrevButton() {
  return (
    <Button
      title="prev"
      onPress={() => {
        const val = position();
        position(val - 1);
      }}
    />
  );
}

function NextButton() {
  return (
    <Button
      title="next"
      onPress={() => {
        const val = position();
        position(val + 1);
      }}
    />
  );
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Position />
        <View style={{ flex: 1, flexDirection: "row" }}>
          <PrevButton />
          <NextButton />
        </View>
      </SafeAreaView>
    </ApolloProvider>
  );
}
