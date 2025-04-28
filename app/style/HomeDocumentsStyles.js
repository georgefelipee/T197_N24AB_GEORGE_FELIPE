import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFF',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    marginRight: 8,
  },
  filtersContainer: {
    backgroundColor: 'rgba(44, 44, 44, 1)',
    marginTop: 16,
    padding: 10,
    borderRadius: 8,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterText: {
    fontSize: 14,
    color: '#FFF',
  },
  card: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  nomeDocumento: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFF',
  },
  expandido: {
    marginTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
});

export default styles;
