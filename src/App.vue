<script setup>
import { reactive } from 'vue'
import { ref } from 'vue'
import { supabase } from './lib/supabase'

const isSubmitting = ref(false)

const formData = reactive({
  title: '',
  description: '',
  category: '',
  priority: '',
  email: ''
})

const errors = reactive({
  title: '',
  description: '',
  category: '',
  priority: '',
  email: ''
})

function validateForm() {
  // Limpia los errores anteriores
  errors.title = ''
  errors.description = ''
  errors.category = ''
  errors.priority = ''
  errors.email = ''

  let isValid = true

  // Validación del título
  if (formData.title.length < 5 || formData.title.length > 60) {
    errors.title = 'El título debe tener entre 5 y 60 caracteres.'
    isValid = false
  }

  // Validación de la descripción
  if (formData.description.length < 20 || formData.description.length > 500) {
    errors.description = 'La descripción debe tener entre 20 y 500 caracteres.'
    isValid = false
  }

  // Validación de la categoría
  if (!formData.category) {
    errors.category = 'La categoría es obligatoria.'
    isValid = false
  }

  // Validación de la prioridad
  const priority = Number(formData.priority)
  if (priority < 1 || priority > 5) {
    errors.priority = 'La prioridad debe ser un número entre 1 y 5.'
    isValid = false
  }

  // Validación del email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(formData.email)) {
    errors.email = 'El email no es válido.'
    isValid = false
  }

  return isValid
}

async function handleSubmit() {
  if (isSubmitting.value) {
    return
  }
  const isValid = validateForm()
  if (!isValid) {
    return
  }
  isSubmitting.value = true

  const { error } = await supabase
  .from('requests')
  .insert([
    {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: Number(formData.priority),
      email: formData.email
    }
  ])
  isSubmitting.value = false

  if (error) {
    alert('Error al guardar la solicitud')
    console.error(error)
    return
  } 
  alert('Solicitud enviada con correctamente')
}

</script>

<template>
  <div>
    <h1>Formulario de solicitud</h1>
    <form @submit.prevent="handleSubmit">
      <div>
        <label>Título</label>
        <input type="text" v-model="formData.title" />
        <p v-if="errors.title" style="color: red">{{ errors.title }}</p>
      </div>

      <div>
        <label>Descripción</label>
        <textarea v-model="formData.description"></textarea>
        <p v-if="errors.description" style="color: red">{{ errors.description }}</p>
      </div>

      <div>
        <label>Categoría</label>
        <input type="text" v-model="formData.category" />
        <p v-if="errors.category" style="color: red">{{ errors.category }}</p>
      </div>

      <div>
        <label>Prioridad</label>
        <select v-model="formData.priority">
          <option value="">Selecciona una prioridad</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <p v-if="errors.priority" style="color: red">{{ errors.priority }}</p>
      </div>

      <div>
        <label>Email</label>
        <input type="email" v-model="formData.email" />
        <p v-if="errors.email" style="color: red">{{ errors.email }}</p>
      </div>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Enviando...' : 'Enviar' }}
      </button>
    </form>
    <pre>{{ formData }}</pre>
  </div>
</template>

<style scoped></style>
