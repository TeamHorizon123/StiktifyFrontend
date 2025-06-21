// import { Button, Modal } from "antd";
// import { ReactNode } from "react";

// interface IProps {
//     title: string,
//     body: ReactNode,
//     footer?: ReactNode,
//     isModalOpen: boolean,
//     setIsModalOpen: (v: boolean) => void
//     onOk?: any,
//     onCancel?: any
// }

// const ModalCustomize = (props: IProps) => {
//     const { body, footer, title, isModalOpen, setIsModalOpen, onOk, onCancel } = props

//     const handleOk = () => {
//         setIsModalOpen(false);
//     };

//     const handleCancel = () => {
//         setIsModalOpen(false);
//     };

//     const ModalFooter = () => {
//         return (
//             <div style={{ display: "flex", gap: 10, justifyContent: "end" }}>
//                 <Button onClick={handleCancel}>Cancel</Button>
//                 <Button onClick={handleOk} type="primary">Ok</Button>
//             </div>
//         )
//     }

//     return (
//         <>
//             <Modal
//                 title={title}
//                 open={isModalOpen}
//                 // onOk={() => {
//                 //     onOk ? onOk() : handleOk()
//                 // }}
//                 onCancel={() => {
//                     handleCancel()
//                 }}
//                 footer={footer ? footer : ModalFooter}
//             >
//                 {body}
//             </Modal>
//         </>
//     );
// };
// export default ModalCustomize
