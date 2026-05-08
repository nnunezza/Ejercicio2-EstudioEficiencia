<script setup>
import { reactive } from 'vue'
import { ref } from 'vue'
import { supabase } from './lib/supabase'
import { onMounted } from 'vue'

const isSubmitting = ref(false)
const submitSuccess = ref('')
const submitError = ref('')
const requests = ref([])
const loadingRequests = ref(false)

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

async function loadRequests() {
  if (!formData.email) return

  loadingRequests.value = true

  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .eq('email', formData.email)
    .order('created_at', { ascending: false })

  loadingRequests.value = false

  if (error) {
    console.error(error)
    return
  }

  requests.value = data
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
  submitSuccess.value = ''
  submitError.value = ''

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
    if (error.message.includes('Failed to fetch')) {
      submitError.value = 'Error de conexión. Por favor, revisa tu red e inténtalo de nuevo.'
    } else {
      submitError.value = 'No se pudo guardar la solicitud. Por favor, inténtalo de nuevo.'
    }
    console.error(error)
    return
  } 
  submitSuccess.value = 'Solicitud enviada con éxito.'

  const currentEmail = formData.email

  formData.title = ''
  formData.description = ''
  formData.category = ''
  formData.priority = ''
  formData.email = currentEmail

  await loadRequests()
}

</script>

<template>
  <div class="container">
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
      <p v-if="submitError" style="color: red">{{ submitError }}</p>
      <p v-if="submitSuccess" style="color: green">{{ submitSuccess }}</p>
    </form>
    
    <h2>Mis solicitudes</h2>

    <p v-if="loadingRequests">Cargando...</p>

    <ul v-if="requests.length">
      <li v-for="req in requests" :key="req.id">
        <strong>{{ req.title }}</strong> - 
        {{ req.category }} - 
        Prioridad: {{ req.priority }}
        <br />
        <small>{{ new Date(req.created_at).toLocaleString() }}</small>
        <small class="request-description">{{ req.description }}</small>
      </li>
    </ul>

    <p v-else>No hay solicitudes aún</p>

  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1, h2 {
  text-align: center;
}

form {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

form div {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

input,
textarea,
select {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

textarea {
  min-height: 80px;
  resize: vertical;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

button:disabled {
  background-color: #999;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #45a049;
}

p {
  margin: 5px 0 0;
}

p[style*="color: green"] {
  background: #e6f9ec;
  padding: 10px;
  border-radius: 6px;
  margin-top: 10px;
}

p[style*="color: red"] {
  background: #fdecea;
  padding: 10px;
  border-radius: 6px;
}

ul {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

li {
  background: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

small {
  color: #666;
}

.request-description {
  display: block;
  margin-top: 5px;
  color: #555;
  font-style: italic;
}

</style>
