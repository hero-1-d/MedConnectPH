import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '../firebase/config.js'

export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    throw error
  }
}

export const uploadProfileImage = async (file, userId) => {
  const path = `profiles/${userId}/${Date.now()}_${file.name}`
  return uploadFile(file, path)
}

export const uploadResourceImage = async (file, resourceId) => {
  const path = `resources/${resourceId}/${Date.now()}_${file.name}`
  return uploadFile(file, path)
}

export const deleteFile = async (path) => {
  try {
    const fileRef = ref(storage, path)
    await deleteObject(fileRef)
    return true
  } catch (error) {
    throw error
  }
}
