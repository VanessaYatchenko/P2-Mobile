import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 

import { database } from '../database/database';

const categorias = ['Alimentação', 'Transporte', 'Lazer', 'Estudos', 'Contas', 'Saúde', 'Outros'];

type Props = {
  navigation: any;
  route: any;
};

export default function AddExpenseScreen({ navigation, route }: Props) {
  const { gastoParaEditar } = route.params || {};
  const isEditing = !!gastoParaEditar;

  const [descricao, setDescricao] = useState(gastoParaEditar?.descricao || '');
  const [categoria, setCategoria] = useState(gastoParaEditar?.categoria || '');
  
  const [valorFormatado, setValorFormatado] = useState(
    gastoParaEditar ? gastoParaEditar.valor.toFixed(2).replace('.', ',') : ''
  );

  const [dataBR, setDataBR] = useState(() => {
    if (gastoParaEditar?.data) {
      const [ano, mes, dia] = gastoParaEditar.data.split('-');
      return `${dia}/${mes}/${ano}`;
    }
    const hoje = new Date();
    return `${String(hoje.getDate()).padStart(2, '0')}/${String(hoje.getMonth() + 1).padStart(2, '0')}/${hoje.getFullYear()}`;
  });

  const formatarValor = (texto: string) => {
    let valor = texto.replace(/\D/g, ''); 
    if (valor.length === 0) return '';
    valor = parseInt(valor, 10).toString();
    if (valor === '0') return '0,00';
    if (valor.length === 1) return `0,0${valor}`;
    if (valor.length === 2) return `0,${valor}`;
    const inteiro = valor.slice(0, -2);
    const decimal = valor.slice(-2);
    return `${inteiro},${decimal}`;
  };

  const onChangeValor = (texto: string) => {
    setValorFormatado(formatarValor(texto));
  };

  const formatarDataInput = (texto: string) => {
    let apenasNumeros = texto.replace(/\D/g, '');
    if (apenasNumeros.length === 0) return '';
    if (apenasNumeros.length <= 2) return apenasNumeros;
    if (apenasNumeros.length <= 4) {
      return `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2)}`;
    }
    return `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2, 4)}/${apenasNumeros.slice(4, 8)}`;
  };

  const onChangeData = (texto: string) => {
    setDataBR(formatarDataInput(texto));
  };

  const getValorNumerico = () => {
    return parseFloat(valorFormatado.replace(/\./g, '').replace(',', '.')) || 0;
  };

  const salvarGasto = () => {
    if (!descricao || !categoria || !valorFormatado) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    const valorNum = getValorNumerico();
    if (valorNum <= 0) {
      Alert.alert('Erro', 'O valor deve ser maior que zero!');
      return;
    }

    if (dataBR.length < 10) {
      Alert.alert('Erro', 'Insira uma data válida no formato DD/MM/AAAA!');
      return;
    }

    const dataISO = dataBR.split('/').reverse().join('-');

    if (isEditing) {
      database.update(gastoParaEditar.id, descricao, categoria, valorNum, dataISO);
    } else {
      database.insert(descricao, categoria, valorNum, dataISO);
    }

    Alert.alert('Sucesso!', isEditing ? 'Gasto atualizado!' : 'Gasto cadastrado!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Descrição do Gasto</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Almoço no restaurante"
          placeholderTextColor="#666"
          value={descricao}
          onChangeText={setDescricao}
        />

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.categoriasContainer}>
          {categorias.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catButton, categoria === cat && styles.catSelected]}
              onPress={() => setCategoria(cat)}
            >
              <Text style={[styles.catText, categoria === cat && styles.catTextSelected]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Valor (R$)</Text>
        <TextInput
          style={styles.input}
          placeholder="0,00"
          keyboardType="numeric"
          value={valorFormatado}
          onChangeText={onChangeValor}
        />

        <Text style={styles.label}>Data (DD/MM/AAAA)</Text>
        <TextInput
          style={styles.input}
          placeholder="20/05/2026"
          value={dataBR}
          onChangeText={onChangeData}
          keyboardType="numeric"
          maxLength={10}
        />

        <TouchableOpacity style={styles.saveButton} onPress={salvarGasto}>
          <View style={styles.buttonContent}>
            <FontAwesome name="save" size={22} color="#000000" style={styles.buttonIcon} />
            <Text style={styles.saveButtonText}>{isEditing ? 'Atualizar Gasto' : 'Salvar Gasto'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0A0A0A' 
  },
  form: { 
    padding: 20 
  },
  label: { 
    color: '#D4AF37', 
    fontSize: 16, 
    marginTop: 16, 
    marginBottom: 6, 
    fontWeight: '500' 
  },
  input: { 
    backgroundColor: '#1A1A1A', 
    color: '#FFFFFF', 
    padding: 14, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#D4AF37', 
    fontSize: 16 
  },
  categoriasContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8, 
    marginVertical: 10 
  },
  catButton: { 
    backgroundColor: '#1A1A1A', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#333' 
  },
  catSelected: { 
    backgroundColor: '#D4AF37', 
    borderColor: '#D4AF37' 
  },
  catText: { 
    color: '#CCC' 
  },
  catTextSelected: { 
    color: '#000', 
    fontWeight: 'bold' 
  },
  saveButton: { 
    backgroundColor: '#D4AF37', 
    padding: 18, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 30 
  },
  buttonContent: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  buttonIcon: { 
    marginRight: 10 
  },
  saveButtonText: { 
    color: '#000', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
});