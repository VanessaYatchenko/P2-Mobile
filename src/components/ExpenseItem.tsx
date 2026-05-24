import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';

type Gasto = {
  id: number;
  descricao: string;
  categoria: string;
  valor: number;
  data: string;
};

type Props = {
  item: Gasto;
  onDelete: (id: number) => void;
  onEdit?: (gasto: Gasto) => void;
  formatarData?: (data: string) => string;
  key?: React.Key;        
};

const ExpenseItem: React.FC<Props> = ({ item, onDelete, onEdit, formatarData }) => {
  const dataFormatada = formatarData ? formatarData(item.data) : item.data;

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.descricao}>{item.descricao}</Text>
        <Text style={styles.categoria}>{item.categoria}</Text>
      </View>

      <View style={styles.valorContainer}>
        {/* Força a exibição da moeda com vírgula dentro do card também */}
        <Text style={styles.valor}>R$ {item.valor.toFixed(2).replace('.', ',')}</Text>
        <Text style={styles.data}>{dataFormatada}</Text>
      </View>

      <View style={styles.actions}>
        {onEdit && (
          <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(item)}>
            <FontAwesome name="pencil" size={20} color="#D4AF37" />
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.deleteBtn}
          onPress={() => Alert.alert('Excluir', 'Deseja excluir este gasto?', [
            { text: 'Cancelar' },
            { text: 'Excluir', onPress: () => onDelete(item.id) }
          ])}
        >
          <FontAwesome6 name="trash-can" size={20} color="#D4AF37" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  info: { flex: 1 },
  descricao: { color: '#FFFFFF', fontSize: 17, fontWeight: '600' },
  categoria: { color: '#D4AF37', fontSize: 14, marginTop: 4 },
  valorContainer: { alignItems: 'flex-end', marginRight: 12 },
  valor: { color: '#D4AF37', fontSize: 18, fontWeight: 'bold' },
  data: { color: '#888', fontSize: 13 },
  actions: { 
    flexDirection: 'row', 
    gap: 14, 
    alignItems: 'center' 
  },
  editBtn: { padding: 4 },
  deleteBtn: { padding: 4 },
});

export default ExpenseItem;