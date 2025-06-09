-- =========================================
-- 🚑 DATABASE KLINIK
-- Membuat database untuk aplikasi manajemen klinik
-- =========================================
CREATE DATABASE klinik_db;
USE klinik_db;

-- =========================================
-- 👨‍⚕️ TABEL DOKTER
-- Menyimpan data dokter seperti nama, spesialisasi, dan nomor telepon
-- =========================================
CREATE TABLE dokter (
    id_dokter INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    spesialisasi VARCHAR(100),
    no_telepon VARCHAR(20)
);

-- =========================================
-- 👤 TABEL PASIEN
-- Menyimpan data pasien seperti nama, alamat, dan nomor telepon
-- =========================================
CREATE TABLE pasien (
    id_pasien INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    alamat TEXT,
    no_telepon VARCHAR(15)
);

-- =========================================
-- 📝 TABEL PENDAFTARAN
-- Menyimpan data kunjungan pasien ke dokter (relasi pasien & dokter)
-- =========================================
CREATE TABLE pendaftaran (
    id_pendaftaran INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_pasien INT,
    id_dokter INT,
    tanggal DATE,
    keluhan TEXT,
    FOREIGN KEY (id_pasien) REFERENCES pasien(id_pasien),
    FOREIGN KEY (id_dokter) REFERENCES dokter(id_dokter)
);

-- =========================================
-- 📋 TABEL REKAM MEDIS
-- Menyimpan hasil pemeriksaan dari pendaftaran tertentu
-- =========================================
CREATE TABLE rekam_medis (
    id_rekam INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_pendaftaran INT,
    diagnosa TEXT,
    tindakan TEXT,
    FOREIGN KEY (id_pendaftaran) REFERENCES pendaftaran(id_pendaftaran)
);

-- =========================================
-- Insert data untuk kebutuhan testing/demo
-- =========================================

-- Data dokter
INSERT INTO dokter (id_dokter, nama, spesialisasi, no_telepon) VALUES
(7, 'dr.Junico Baan', 'Jantungg', '098684940500'),
(8, 'dr.Ihsan', 'syaraf', '0939993'),
(9, 'dr.Rafael Joseph', 'mata', '099039903');

-- Data pasien
INSERT INTO pasien (id_pasien, nama, alamat, no_telepon) VALUES
(9, 'nicooL', 'Makassar', '0950400'),
(10, 'yona', 'kalianget', '0999383938'),
(11, 'adam', 'gresik', '8899998');

-- Data pendaftaran
INSERT INTO pendaftaran (id_pendaftaran, id_pasien, id_dokter, tanggal, keluhan) VALUES
(12, 9, 9, '2025-06-07', 'sakit bagian dalam mata, keluar air mata terussss'),
(13, 10, 8, '2025-06-06', 'demam, badan menggigil, sakit kepala'),
(14, 11, 7, '2025-06-05', 'sakit bagian dada dan sesak bgt');

-- Data rekam medis
INSERT INTO rekam_medis (id_rekam, id_pendaftaran, diagnosa, tindakan) VALUES
(3, 12, 'kemungkinan matanya kena bintitan wkwkkkk', 
    'perlu dikasih salep 3x sehari pada bagian benjolan saja'),
(4, 13, 'kemungkinan syaraf bagian kepala terganggu', 
    'di berikan obat paracetamol dan istirahat secukupnya'),
(5, 14, 'kemungkinan adam terlalu kecapekan sehingga memicu dada sesak dan sakit, namun ini tidak berbahaya', 
    'cukup istirahat yg banyak serta kurangi melakukan aktivitas yang berat');
