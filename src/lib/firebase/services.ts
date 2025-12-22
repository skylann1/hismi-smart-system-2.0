import { app } from "./config";
import { getFirestore, collection, addDoc, getDocs, query, where, getDoc, doc, updateDoc, setDoc, writeBatch, deleteDoc, getCountFromServer, runTransaction } from "firebase/firestore";
import bcrypt from "bcryptjs";
import type { UserType, DivisiSettingsType, FormBlog, PertemuanFormData, ProkerFormData, KegiatanFormData, PaslonType } from "@/types";

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

export async function addPertemuan(
  data: PertemuanFormData,
  callback: (result: { success: boolean; message?: string }) => void
) {
  try {
    // Tambah data pertemuan
    const pertemuanRef = await addDoc(collection(firestore, "pertemuan"), {
      ...data,
      createdAt: new Date(),
    });

    // Ambil semua user
    const usersSnapshot = await getDocs(collection(firestore, "users"));
    if (usersSnapshot.empty) {
      return callback({
        success: false,
        message: "Tidak ada data user untuk dibuatkan absensi.",
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const absenPromises: Promise<any>[] = [];

    usersSnapshot.forEach((userDoc) => {
      const userData = userDoc.data() as UserType;

      if (!userData.nama || !userData.divisi || !userData.role) return;

      const absenRef = doc(
        firestore,
        "pertemuan",
        pertemuanRef.id,
        "absen",
        userDoc.id
      );

      absenPromises.push(
        setDoc(absenRef, {
          userId: userDoc.id,
          nama: userData.nama,
          nim: userData.nim,
          divisi: userData.divisi,
          role: userData.role,
          status: "absen",
          email: userData.email,
          no_hp: userData.no_hp,
          imageUrl: userData.imageUrl,
          createdAt: new Date(),
        })
      );
    });

    await Promise.all(absenPromises);

    callback({
      success: true,
      message: "Pertemuan dan absensi anggota berhasil ditambahkan.",
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Error addPertemuan:", err);
    callback({
      success: false,
      message: err.message || "Terjadi kesalahan di server.",
    });
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

export async function updateProker(data: Partial<ProkerFormData>, id: string) {
  try {
    const snapshot = await getDoc(doc(firestore, "proker", id));
    if (!snapshot.exists()) {
      return { ok: false, message: "Data proker tidak ditemukan." }
    }
    const docRef = doc(firestore, "proker", snapshot.id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date()
    });
    return { ok: true, message: "Proker berhasil di update." }
  } catch (err) {
    console.error("Error updating proker:", err);
    return { ok: false, message: "ada sesuatu yang salah di database." }
  }
}

export async function addProker(
  data: ProkerFormData,
  callback: (result: { success: boolean; message?: string }) => void
) {
  try {
    // Tambah data proker
    const prokerRef = await addDoc(collection(firestore, "proker"), {
      ...data,
      createdAt: new Date(),
    });

    // Ambil semua user
    const usersSnapshot = await getDocs(collection(firestore, "users"));
    if (usersSnapshot.empty) {
      return callback({
        success: false,
        message: "Tidak ada data user untuk dibuatkan absensi.",
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const absenPromises: Promise<any>[] = [];

    usersSnapshot.forEach((userDoc) => {
      const userData = userDoc.data() as UserType;

      if (!userData.nama || !userData.divisi || !userData.role) return;

      const absenRef = doc(
        firestore,
        "proker",
        prokerRef.id,
        "absen",
        userDoc.id
      );

      absenPromises.push(
        setDoc(absenRef, {
          userId: userDoc.id,
          nama: userData.nama,
          nim: userData.nim,
          divisi: userData.divisi,
          role: userData.role,
          status: "absen",
          email: userData.email,
          no_hp: userData.no_hp,
          imageUrl: userData.imageUrl,
          createdAt: new Date(),
        })
      );
    });

    await Promise.all(absenPromises);

    callback({
      success: true,
      message: "Proker dan absensi anggota berhasil ditambahkan.",
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Error addProker:", err);
    callback({
      success: false,
      message: err.message || "Terjadi kesalahan di server.",
    });
  }
}


export async function addKegiatan(
  data: KegiatanFormData,
  callback: (result: { success: boolean; message?: string }) => void
) {
  try {
    if (!data.judul || !data.tanggal || !data.lokasi) {
      return callback({
        success: false,
        message: "Nama, tanggal, dan lokasi wajib diisi.",
      });
    }

    const q = query(
      collection(firestore, "kegiatan"),
      where("nama", "==", data.judul),
      where("tanggal", "==", data.tanggal)
    );
    const existing = await getDocs(q);
    if (!existing.empty) {
      return callback({
        success: false,
        message: "Kegiatan dengan nama dan tanggal tersebut sudah ada.",
      });
    }

    const kegiatanRef = await addDoc(collection(firestore, "kegiatan"), {
      ...data,
      createdAt: new Date(),
    });

    const usersSnapshot = await getDocs(collection(firestore, "users"));
    if (usersSnapshot.empty) {
      return callback({
        success: false,
        message: "Tidak ada data user untuk dibuatkan absensi.",
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const absenPromises: Promise<any>[] = [];

    usersSnapshot.forEach((userDoc) => {
      const userData = userDoc.data() as UserType;

      if (!userData.nama || !userData.divisi || !userData.role) return;

      const absenRef = doc(
        firestore,
        "kegiatan",
        kegiatanRef.id,
        "absen",
        userDoc.id
      );

      absenPromises.push(
        setDoc(absenRef, {
          userId: userDoc.id,
          nama: userData.nama,
          nim: userData.nim,
          divisi: userData.divisi,
          role: userData.role,
          status: "absen",
          email: userData.email,
          no_hp: userData.no_hp,
          imageUrl: userData.imageUrl,
          createdAt: new Date(),
        })
      );
    });

    await Promise.all(absenPromises);

    // ✅ 6️⃣ Callback sukses
    callback({
      success: true,
      message: "Kegiatan dan absensi anggota berhasil ditambahkan.",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Error addKegiatan:", err);
    callback({
      success: false,
      message: err.message || "Terjadi kesalahan di server.",
    });
  }
}

export async function updateKegiatan(data: Partial<KegiatanFormData>, id: string) {
  try {
    const snapshot = await getDoc(doc(firestore, "kegiatan", id));

    if (!snapshot.exists()) {
      return { ok: false, message: "Data kegiatan tidak ditemukan." };
    }

    const docRef = doc(firestore, "kegiatan", snapshot.id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });

    return { ok: true, message: "Kegiatan berhasil diupdate." };
  } catch (err) {
    console.error("Error updating kegiatan:", err);
    return { ok: false, message: "Ada sesuatu yang salah di database." };
  }
}

// absensi
export async function getAbsenInCollection(
  collectionName: string,
  id: string
) {
  try {
    const kegiatanRef = doc(firestore, collectionName, id);
    const kegiatanSnap = await getDoc(kegiatanRef);

    if (!kegiatanSnap.exists()) {
      return { success: false, message: "Data kegiatan tidak ditemukan." };
    }

    const absenRef = collection(firestore, collectionName, id, "absen");
    const absenSnap = await getDocs(absenRef);

    const absenList = absenSnap.docs.map((absen) => ({
      id: absen.id,
      ...absen.data(),
    }));

    const data = {
      id: kegiatanSnap.id,
      ...kegiatanSnap.data(),
      absen: absenList,
    };

    return { success: true, data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Error getKegiatanWithAbsen:", err);
    return { success: false, message: err.message };
  }
}

type AttendanceUpdate = {
  id: string; // member id
  status: string;
};

export async function updateAbsen(eventId: string, absenList: AttendanceUpdate[], collectionName: string) {
  try {
    const batch = writeBatch(firestore);

    for (const member of absenList) {
      const memberRef = doc(firestore, `${collectionName}/${eventId}/absen/${member.id}`);
      batch.set(memberRef, {
        status: member.status,
        updatedAt: new Date(),
      }, { merge: true });
    }

    await batch.commit();

    return { success: true, message: "Absensi berhasil diperbarui" };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error updating absen:", error);
    return { success: false, message: error.message || "Gagal update absensi" };
  }
}

export async function getAbsenByNim(
  collectionName: string, 
  kegiatanId: string,     
  nim: string             
) {
  try {
    const absenRef = collection(firestore, collectionName, kegiatanId, "absen");
    const q = query(absenRef, where("nim", "==", nim));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { success: false, message: "Data absen anggota tidak ditemukan." };
    }

    const absenData = snapshot.docs[0].data();
    const absenId = snapshot.docs[0].id;

    return {
      success: true,
      data: { id: absenId, ...absenData },
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Error getAbsenByNim:", err);
    return { success: false, message: err.message };
  }
}

export async function getAllAbsenFromAllCollections() {
  try {
    const parentCollections = ["proker", "kegiatan", "pertemuan"];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allAbsen: any[] = [];

    for (const parent of parentCollections) {
      const parentRef = collection(firestore, parent);
      const parentSnapshot = await getDocs(parentRef);

      for (const parentDoc of parentSnapshot.docs) {
        const absenRef = collection(
          firestore,
          parent,
          parentDoc.id,
          "absen"
        );

        const absenSnapshot = await getDocs(absenRef);

        absenSnapshot.docs.forEach((absenDoc) => {
          allAbsen.push({
            id: absenDoc.id,
            parentJudul: parentDoc.data().judul || parentDoc.data().nama || "N/A",
            parentCollection: parent,
            parentId: parentDoc.id,
            ...absenDoc.data(),
          });
        });
      }
    }

    if (allAbsen.length === 0) {
      return {
        success: false,
        message: "Data absen tidak ditemukan.",
      };
    }

    return {
      success: true,
      data: allAbsen,
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Error getAllAbsenFromAllCollections:", err);
    return {
      success: false,
      message: err.message,
    };
  }
}

export async function getAllAbsenByAnggotaIdWithUser(anggotaId: string) {
  try {
    const parentCollections = ["proker", "kegiatan", "pertemuan"];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allAbsen: any[] = [];

    const userRef = doc(firestore, "users", anggotaId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return {
        success: false,
        message: "Data user tidak ditemukan.",
      };
    }

    const userData = {
      id: userSnap.id,
      ...userSnap.data(),
    };

    for (const parent of parentCollections) {
      const parentRef = collection(firestore, parent);
      const parentSnapshot = await getDocs(parentRef);

      for (const parentDoc of parentSnapshot.docs) {
        const absenRef = collection(
          firestore,
          parent,
          parentDoc.id,
          "absen"
        );

        const absenSnapshot = await getDocs(absenRef);

        absenSnapshot.docs.forEach((absenDoc) => {
          const data = absenDoc.data();

          if (data.userId === anggotaId) {
            allAbsen.push({
              // 🔹 DATA ABSEN
              status: data.status,
              keterangan: data.keterangan || null,
              createdAt: data.createdAt || null,

              // 🔹 INFO ASAL ABSEN
              parentCollection: parent,
              parentId: parentDoc.id,
              parentJudul:
                parentDoc.data().judul ||
                parentDoc.data().nama ||
                "N/A",
              tanggal: parentDoc.data().tanggal || null,
            });
          }
        });
      }
    }

    if (allAbsen.length === 0) {
      return {
        success: false,
        message: "Data absensi anggota tidak ditemukan.",
      };
    }

    return {
      success: true,
      user: userData,
      data: allAbsen,
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Error getAllAbsenByAnggotaIdWithUser:", err);
    return {
      success: false,
      message: err.message,
    };
  }
}

export async function addPaslon(data: PaslonType) {
  try {
    const docRef = await addDoc(collection(firestore, "paslon"), {
      ...data,
      createdAt: new Date(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Gagal save db" };
  }
}

export async function getPaslons() {
  try {
    const q = query(collection(firestore, "paslon"));
    const snapshot = await getDocs(q);
    
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    return { success: true, data };
  } catch {
    return { success: false, message: "Gagal ambil data paslon" };
  }
}

// 1. Ambil detail paslon buat dapet URL foto
export async function getPaslonById(id: string) {
  try {
    const snapshot = await getDoc(doc(firestore, "paslon", id));
    if (!snapshot.exists()) return { success: false, message: "Data tidak ditemukan" };
    return { success: true, data: snapshot.data() };
  } catch {
    return { success: false, message: "Error get detail" };
  }
}

// 2. Hapus dokumen dari firestore
export async function deletePaslon(id: string) {
  try {
    await deleteDoc(doc(firestore, "paslon", id));
    return { success: true };
  } catch {
    return { success: false, message: "Gagal hapus data database" };
  }
}

// edit paslon 
export async function updatePaslon(id: string, data: Partial<PaslonType>) {
  try {
    const docRef = doc(firestore, "paslon", id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });
    return { success: true };
  } catch {
    return { success: false, message: "Gagal update database" };
  }
}

export async function getPemiluConfig() {
  try {
    // Kita simpan di collection 'settings', document 'pemilu_config'
    const docRef = doc(firestore, "settings", "pemilu_config");
    const snapshot = await getDoc(docRef);
    
    if (snapshot.exists()) {
      return { success: true, data: snapshot.data() };
    } else {
      // Default value kalo belum ada
      return { success: true, data: { isVotingOpen: false, isResultPublished: false } };
    }
  } catch{
    return { success: false, message: "Gagal ambil config" };
  }
}

// Update Config
export async function updatePemiluConfig(data: { isVotingOpen: boolean; isResultPublished: boolean }) {
  try {
    const docRef = doc(firestore, "settings", "pemilu_config");
    // Pakai setDoc dengan merge:true biar aman
    await setDoc(docRef, { ...data, updatedAt: new Date() }, { merge: true });
    return { success: true };
  } catch{
    return { success: false, message: "Gagal update config" };
  }
}

// Ambil Data Paslon + Jumlah Suaranya
export async function getRealCountResults() {
  try {
    // 1. Ambil List Paslon dulu
    const paslonSnap = await getDocs(collection(firestore, "paslon"));
    
    // 2. Hitung suara untuk setiap paslon
    const results = await Promise.all(
      paslonSnap.docs.map(async (doc) => {
        const paslonData = doc.data();
        
        // Query ke collection 'votes' hitung yang milih paslon ini
        // Asumsi: di collection 'votes' ada field 'chosenPaslonId'
        const q = query(collection(firestore, "votes"), where("chosenPaslonId", "==", doc.id));
        const snapshot = await getCountFromServer(q);
        
        return {
          id: doc.id,
          nomor_urut: paslonData.nomor_urut,
          ketua: paslonData.ketua.nama,
          wakil: paslonData.wakil.nama,
          foto: paslonData.ketua.foto, // Buat display
          totalSuara: snapshot.data().count, // Jumlah suara real
        };
      })
    );

    // 3. Hitung Total Suara Masuk (Buat persentase)
    const totalVotesAll = results.reduce((acc, curr) => acc + curr.totalSuara, 0);

    return { success: true, data: results, totalVotesAll };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Gagal menghitung suara" };
  }
}

export async function checkUserVoted(userId: string) {
  try {
    // Kita cek apakah ada dokumen di collection 'votes' dengan ID = userId
    // Ini cara paling efisien memastikan 1 user 1 suara
    const voteDoc = await getDoc(doc(firestore, "votes", userId));
    return voteDoc.exists();
  } catch {
    return false;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function submitVote(userId: string, paslonId: string, userProfile: any) {
  try {
    await runTransaction(firestore, async (transaction) => {
      // 1. Referensi dokumen
      const voteRef = doc(firestore, "votes", userId); // ID dokumen = ID user
      const paslonRef = doc(firestore, "paslon", paslonId);

      // 2. Baca dulu (Prerequisite Transaction)
      const voteSnap = await transaction.get(voteRef);
      const paslonSnap = await transaction.get(paslonRef);

      // 3. Validasi
      if (voteSnap.exists()) {
        throw "Anda sudah melakukan voting sebelumnya!";
      }
      if (!paslonSnap.exists()) {
        throw "Paslon tidak ditemukan!";
      }

      // 4. Tulis Data (Simpan vote)
      transaction.set(voteRef, {
        userId: userId,
        chosenPaslonId: paslonId,
        voterEmail: userProfile.email,
        createdAt: new Date(),
      });
      
      // Note: Kita TIDAK perlu increment counter di dokumen Paslon secara manual
      // karena kita pakai sistem Real Count (hitung jumlah dokumen di collection votes) 
      // yang sudah kita buat di part Result sebelumnya. Ini lebih akurat.
    });

    return { success: true };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Transaction failed: ", error);
    return { success: false, message: typeof error === "string" ? error : "Gagal menyimpan suara." };
  }
}

export async function resetAllVotes() {
  try {
    const batch = writeBatch(firestore);
    const votesSnapshot = await getDocs(collection(firestore, "votes"));

    if (votesSnapshot.empty) {
      return { success: true, message: "Tidak ada data suara untuk dihapus." };
    }

    // Loop semua dokumen dan tandai untuk dihapus
    votesSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Eksekusi hapus massal
    await batch.commit();

    return { success: true, message: "Semua data suara berhasil di-reset." };
  } catch (error) {
    console.error("Error resetting votes:", error);
    return { success: false, message: "Gagal me-reset data suara." };
  }
}

export async function getAllVotes() {
  try {
    const snapshot = await getDocs(collection(firestore, "votes"));

    if (snapshot.empty) {
      return { success: true, data: [] };
    }

    // Mapping data biar API nerima data bersih
    const data = snapshot.docs.map((doc) => {
      const docData = doc.data();
      
      // Handle timestamp biar aman pas dikirim
      let votingTime = null;
      if (docData.createdAt) {
        // Cek tipe timestamp firestore
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        votingTime = (docData.createdAt as any).toDate 
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ? (docData.createdAt as any).toDate() 
          : new Date(docData.createdAt);
      }

      return {
        id: doc.id, // User ID
        voterEmail: docData.voterEmail || "-",
        votingTime: votingTime,
        // Kita GAK ambil chosenPaslonId biar aman privacy-nya
      };
    });

    return { success: true, data };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error get votes:", error);
    return { success: false, message: error.message };
  }
}