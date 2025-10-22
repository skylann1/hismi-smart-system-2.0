import { app } from "./config";
import { getFirestore, collection, addDoc, getDocs, query, where, getDoc, doc, updateDoc } from "firebase/firestore";
import bcrypt from "bcryptjs";
import type { UserType, DivisiSettingsType, FormBlog, PertemuanFormData } from "@/types";

const firestore = getFirestore(app);

export async function getData(collectionName: string) {
  try {
    const querySnapshot = await getDocs(collection(firestore, collectionName));
    const datas = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (datas.length === 0) {
      return { success: false, message: `No data found in ${collectionName} collection.` };
    }
    return { success: true, datas };
  } catch (error) {
    return { success: false, error };
  }
}

export async function getDataById(collectionName: string, id: string) {
  const snapshot = await getDoc(doc(firestore, collectionName, id));
  if (!snapshot.exists()) {
    return { success: false, message: `No data ${id} found in ${collectionName} collection nama.` };
  }
  return { success: true, data: { id: snapshot.id, ...snapshot.data() } };
}

export async function getDataByNama(collectionName: string, nama: string) {
  const q = query(collection(firestore, collectionName), where("nama", "==", nama));
  const snapshot = await getDocs(q);
  const existingData = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as Array<{ id: string; email: string }>;
  if (snapshot.empty) {
    return { success: false, message: `no data found by nama ${nama} in ${collectionName} collection` };
  }
  return { success: true, data: existingData[0] };
}

export async function addAnggota(data: {
  nama: string;
  tanggal_lahir: string;
  email: string;
  no_hp: string;
  nim: string;
  jenjang_pendidikan: string;
  semester: number;
  tipe_kelas: string;
  tahun_masuk: string;
  divisi: string;
  role: string;
  imageUrl?: string;
  password?: string;
  access: string[];
}, callback: (result: { success: boolean; message?: string }) => void) {

  const q = query(collection(firestore, "users"), where("email", "==", data.email));
  const querySnapshot = await getDocs(q);
  const existingData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as Array<{ id: string; email: string }>;

  if (existingData.length > 0) {
    callback({ success: false, message: "Email sudah terdaftar." });
    return;
  }

  const defaultPassword = data.tanggal_lahir.replace(/-/g, "");
  data.password = await bcrypt.hash(defaultPassword || "himsikaliabang", 10);

  await addDoc(collection(firestore, "users"), data).then(() => {
    callback({ success: true, message: "Data anggota berhasil ditambahkan." });
  }).catch((error) => {
    callback({ success: false, message: error.message });
  });
}

export async function login(data: { email: string }) {
  const q = query(collection(firestore, "users"), where("email", "==", data.email));
  const snapshot = await getDocs(q);
  const user = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }))

  if (user.length === 0) {
    return { success: false, message: "Email tidak terdaftar pada system." };
  }
  return { success: true, message: "Email ditemukan.", data: user[0] };
}

export async function updateUser(
  collectionName: string,
  id: string,
  data: Partial<UserType>
) {
  try {
    const docRef = doc(firestore, collectionName, id);

    if (data.tanggal_lahir) {
      const defaultPassword = (data.tanggal_lahir as string).replace(/-/g, "");
      data.password = await bcrypt.hash(defaultPassword || "himsikaliabang", 10);
    }

    await updateDoc(docRef, data);

    return { success: true, message: "User updated successfully" };
  } catch (err) {
    let message = "An unknown error occurred.";
    if (err instanceof Error) {
      message = err.message;
    }
    return { success: false, message };
  }
}

export async function updateDivisiDesc(
  collectionName: string,
  divisi: string,
  data: Partial<DivisiSettingsType>
) {
  try {
    const q = query(collection(firestore, collectionName), where("nama", "==", divisi));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { ok: false, message: "Divisi tidak ditemukan" };
    }

    const docRef = doc(firestore, collectionName, querySnapshot.docs[0].id);

    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date()
    });

    return { ok: true, message: "Divisi berhasil diupdate" };
  } catch (error) {
    console.error("Error updateDivisiDesc:", error);
    return { ok: false, message: "Gagal update divisi", error };
  }
}

export async function addBlog(data: FormBlog, callback: (result: { success: boolean; message?: string }) => void) {
  try {
    await addDoc(collection(firestore, "blog"), data).then(() => {
      callback({ success: true, message: "Blog berhasil di tambahkan ke system." })
    }).catch((err) => {
      callback({ success: false, message: err.message })
    })
  } catch {
    return callback({ success: true, message: "Opps something when wrong in the server." })
  }
}

export async function updateBlog(id: string, data: Partial<FormBlog>) {
  try {
    const snapshot = await getDoc(doc(firestore, "blog", id));

    if (!snapshot.exists()) {
      return { ok: false, message: "Data tidak di temukan.", data: snapshot.data() }
    }

    const docRef = doc(firestore, "blog", snapshot.id);

    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date()
    });

    return { ok: true, message: "Blog berhasil di update." }
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Unknown error" }
  }
}

export async function addPertemuan(data: PertemuanFormData, callback: (result: { success: boolean; message?: string }) => void) {
  try {
    await addDoc(collection(firestore, "pertemuan"), data).then(() => {
      callback({ success: true, message: "Pertemuan berhasil ditambahkan." });
    }).catch((err) => {
      callback({ success: false, message: err.message });
    });
  } catch {
    return callback({ success: false, message: "Opps something went wrong in the server." });
  }
}

export async function updatePertemuan(data: Partial<PertemuanFormData>, id: string) {
  try {
    const snapshot = await getDoc(doc(firestore, "pertemuan", id));

    if (!snapshot.exists()) {
      return { ok: false, message: "Data pertemuan tidak ditemukan." }
    }
    const docRef = doc(firestore, "pertemuan", snapshot.id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date()
    });
    return { ok: true, message: "Pertemuan berhasil di update." }
  } catch {
    return { ok: false, message: "ada sesusati yang salah di database." }
  }
}