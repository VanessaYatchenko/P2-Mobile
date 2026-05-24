import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { database, initDatabase } from '../database/database';
import ExpenseItem from '../components/ExpenseItem';

const categoriasFiltro = ['Todos', 'Alimentação', 'Transporte', 'Lazer', 'Estudos', 'Contas', 'Saúde', 'Outros'];

type Gasto = {
  id: number;
  descricao: string;
  categoria: string;
  valor: number;
  data: string;
};

export default function HomeScreen({ navigation }: any) {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [total, setTotal] = useState(0);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos');
  const isFocused = useIsFocused();

  useEffect(() => {
    initDatabase();
  }, []);

  useEffect(() => {
    if (isFocused) {
      carregarDados();
    }
  }, [isFocused]);

  const carregarDados = () => {
    const dados = database.getAll() as Gasto[];
    setGastos(dados);
    
    const novoTotal = dados.reduce((acc, item) => acc + item.valor, 0);
    setTotal(novoTotal);
  };

  const excluirGasto = (id: number) => {
    database.delete(id);
    carregarDados();
  };

  const formatarDataBR = (data: string) => {
    if (!data) return '';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const gastosFiltrados = categoriaSelecionada === 'Todos'
    ? gastos
    : gastos.filter(gasto => gasto.categoria.trim() === categoriaSelecionada.trim());

  return (
    <View style={styles.container}>
      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>TOTAL GASTO</Text>
        <Text style={styles.totalValue}>R$ {total.toFixed(2).replace('.', ',')}</Text>
      </View>

      <Text style={styles.sectionTitle}>Filtrar por Categoria:</Text>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollFilter}>
          {categoriasFiltro.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.filterButton,
                categoriaSelecionada === cat && styles.filterButtonSelected
              ]}
              onPress={() => setCategoriaSelecionada(cat)}
            >
              <Text style={[
                styles.filterText,
                categoriaSelecionada === cat && styles.filterTextSelected
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.listContainer}>
        {gastosFiltrados.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.empty}>
              {categoriaSelecionada === 'Todos' 
                ? 'Olha, não tem nenhum gasto cadastrado ainda.' 
                : `Nenhum gasto encontrado na categoria "${categoriaSelecionada}".`}
            </Text>
          </View>
        ) : (
          gastosFiltrados.map(item => (
            <ExpenseItem 
              key={item.id}
              item={item} 
              onDelete={excluirGasto}
              onEdit={(gasto) => navigation.navigate('AddExpense', { 
                gastoParaEditar: gasto
              })}
              formatarData={formatarDataBR}
            />
          ))
        )}

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>© 2026 Vanessa Macedo.</Text>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.addBtn} 
        onPress={() => navigation.navigate('AddExpense')}
      >
        <Text style={styles.addBtnText}>+ Novo Gasto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  totalBox: { 
    backgroundColor: '#1A1A1A', 
    padding: 25, 
    alignItems: 'center', 
    borderBottomWidth: 2, 
    borderBottomColor: '#D4AF37' 
  },
  totalLabel: { color: '#D4AF37', fontSize: 16 },
  totalValue: { color: '#FFF', fontSize: 34, fontWeight: 'bold', marginTop: 8 },
  
  sectionTitle: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 4,
  },
  filterContainer: {
    marginBottom: 10,
    height: 45,
  },
  scrollFilter: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
    height: 40,
  },
  filterButtonSelected: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  filterText: { color: '#CCC', fontSize: 14 },
  filterTextSelected: { color: '#000', fontWeight: 'bold' },

  listContainer: { flex: 1 },
  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 60 
  },
  empty: { 
    color: '#777', 
    fontSize: 16, 
    textAlign: 'center',
    paddingHorizontal: 20
  },
  addBtn: { 
    backgroundColor: '#D4AF37', 
    margin: 16, 
    padding: 18, 
    borderRadius: 12, 
    alignItems: 'center' 
  },
  addBtnText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  
  footerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginTop: 20,
  },
  footerText: {
    color: '#555555',
    fontSize: 12,
    fontWeight: '400',
  },
});