"use client"; // これを追加
import { useState } from 'react';
import Modal from "@/components/modal";

export default function ThreadPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button onClick={openModal}>モーダルを開く</button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ThreadData>
      </Modal>
    </div>
  );
}