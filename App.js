import React from "react";
import { FlatList, SafeAreaView, Button, View, Alert } from "react-native";
import { InMemoryCache, gql, makeVar, ApolloClient } from "@apollo/client";
import { ApolloProvider, useQuery } from "@apollo/react-hooks";

const typeDefs = gql`
  type Agenda {
    name: String!
    items: [String!]!
  }

  type Query {
    allAgendas: [Agenda!]!
    addAgenda(name: String!): Agenda!
    addItem(agendaName: String!, name: String!): Agenda!
    removeAgenda(name: String!): Boolean!
    removeItem(agendaName: String!, name: String!): Agenda!
  }
`;

const allAgendas = makeVar([
  {
    name: "AVI Training",
    items: ["Get the Gear", "Get the Training", "Get the Report"],
  },
  {
    name: "How to Backpack",
    items: [
      "Research a Trip",
      "Obtain Permits",
      "Pack Your Pack",
      "Start Hiking",
    ],
  },
]);

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        allAgendas: {
          read() {
            return allAgendas();
          },
        },
      },
    },
  },
});

const client = new ApolloClient({ cache });

const ALL_AGENDAS_QUERY = gql`
  query {
    allAgendas @client {
      name
      items
    }
  }
`;

function useAgendas() {
  return {
    deleteAgenda(name) {
      console.log(`delete ${name}`);
      const a = allAgendas();
      console.log(a.length);
      const less = a.filter((item) => item.name !== name);
      allAgendas(less);
    },
  };
}

function AgendaDisplay({ name, items = [] }) {
  const { deleteAgenda } = useAgendas();
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Button
        title={`${name} - ${items.length} items`}
        onPress={() => Alert.alert(`TODO: Start ${name}`)}
      />
      <Button title="delete" color="red" onPress={() => deleteAgenda(name)} />
    </View>
  );
}

function AgendaList() {
  const { loading, error, data } = useQuery(ALL_AGENDAS_QUERY);

  console.log("render ", data);

  if (loading) return <Text>Loading</Text>;
  if (error) return <Text>{JSON.stringify(error, null, 2)}</Text>;

  return (
    <FlatList
      data={data.allAgendas}
      keyExtractor={(_, i) => `agenda-${i}`}
      renderItem={({ item }) => <AgendaDisplay {...item} />}
    />
  );
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <SafeAreaView>
        <AgendaList />
      </SafeAreaView>
    </ApolloProvider>
  );
}
