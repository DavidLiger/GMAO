import React, {useEffect, useState} from 'react';
import {useAPIRequest} from '../../api/apiRequest';
import {Tab} from '@headlessui/react';
import {FaEdit, FaMinus, FaPlus, FaSave, FaTimes, FaTrashAlt} from 'react-icons/fa';
import {Modal, TextInput} from "flowbite-react";
import DynamicInput from "../../dynamicInput/dynamicInput";
import BioButton from "../../button/BioButton";
import i18n from "../../../i18n";
import {useToast} from "../../../providers/toastProvider";
import {HiOutlineExclamationCircle} from "react-icons/hi";
import {useRouter} from "next/navigation";
import ChildAdditionModal from "./ChildAdditionModal";
import {FaLink} from "react-icons/fa6";

export default function ChildSearch({bien}) {
    const apiRequest = useAPIRequest();
    const router = useRouter();
    const [treeData, setTreeData] = useState(null);
    const [filteredTreeData, setFilteredTreeData] = useState(null);
    const [nodeDetail, setNodeDetail] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [collapsedNodes, setCollapsedNodes] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditingAll, setIsEditingAll] = useState(false);
    const [openModalConfirmDelete, setOpenModalConfirmDelete] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [editedCaracteristiques, setEditedCaracteristiques] = useState({});
    const {addToast} = useToast();

    useEffect(() => {
        const fetchTree = async () => {
            try {
                const response = await apiRequest(`/api/bien/tree/${bien.id}`, 'GET');
                const data = await response.json();

                const allNodeIds = new Set();
                const collectNodeIds = (nodes) => {
                    nodes.forEach((node) => {
                        allNodeIds.add(node.id);
                        if (node.children) {
                            collectNodeIds(node.children);
                        }
                    });
                };
                collectNodeIds(data);
                setCollapsedNodes(allNodeIds);
                setSelectedNode(bien);

                setTreeData(data);
                setFilteredTreeData(data); // Initialiser avec l'arbre complet
            } catch (error) {
                console.error('Error fetching tree data:', error);
            }
        };
        fetchTree();
    }, [bien.id]);

    useEffect(() => {
        const fetchCarac = async () => {
            setIsEditingAll(false);
            try {
                const response = await apiRequest(`/api/bien/${selectedNode.id}/caracteristiques`, 'GET');
                const data = await response.json();
                setNodeDetail(data ?? []); // Initialiser avec un tableau vide si null
            } catch (error) {
                console.error("Erreur lors de la récupération des caractéristiques :", error);
                setNodeDetail([]);
            }
        };
        fetchCarac()
    }, [selectedNode]);

    const toggleNodeCollapse = (nodeId) => {
        setCollapsedNodes((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(nodeId)) {
                newSet.delete(nodeId);
            } else {
                newSet.add(nodeId);
            }
            return newSet;
        });
    };

    const collectParentIds = (nodes, targetId, parentIds = []) => {
        for (const node of nodes) {
            if (node.id === targetId) {
                return parentIds;
            }
            if (node.children) {
                const result = collectParentIds(node.children, targetId, [...parentIds, node.id]);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    };

    const handleSaveCaracteristiques = async () => {
        try {
            // Préparer les mises à jour pour les caractéristiques existantes
            const existingUpdates = Object.keys(editedCaracteristiques)
                .map((id) => {
                    const value = editedCaracteristiques[id];
                    const caract = nodeDetail.find(
                        (c) => c.caracteristique.id === parseInt(id, 10)
                    );
                    if (!caract) return null;
                    return {
                        id: parseInt(id, 10),
                        value,
                        priorite: caract.priorite,
                    };
                })
                .filter((item) => item !== null);

            const combinedPayload = [...existingUpdates];

            await apiRequest(`/api/bien/caracteristiques/${selectedNode.id}`, 'POST', combinedPayload);

            // Mise à jour de l'état avec les caractéristiques mises à jour
            setNodeDetail((prev) => {
                return prev.map((caract) => {
                    const update = existingUpdates.find(
                        (u) => u.id === caract.caracteristique.id
                    );
                    return update ? {...caract, valeur: update.value} : caract;
                });
            });

            setEditedCaracteristiques({});
            setIsEditingAll(false);
        } catch (error) {
            console.error("Erreur lors de l'enregistrement des caractéristiques :", error);
        }
    };

    const filterTree = (nodes, term) => {
        return nodes
            .map((node) => {
                if (node.nom.toLowerCase().includes(term.toLowerCase())) {
                    return node;
                }
                if (node.children) {
                    const filteredChildren = filterTree(node.children, term);
                    if (filteredChildren.length > 0) {
                        return {...node, children: filteredChildren};
                    }
                }
                return null;
            })
            .filter((node) => node !== null);
    };

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term.trim() === '') {
            setFilteredTreeData(treeData);
            // Replier tous les nœuds
            setCollapsedNodes(new Set(treeData.flatMap((node) => getAllNodeIds(node))));
        } else {
            const filteredData = filterTree(treeData, term);
            setFilteredTreeData(filteredData);

            const newCollapsedNodes = new Set();
            const collapseAll = (nodes) => {
                nodes.forEach((node) => {
                    newCollapsedNodes.add(node.id);
                    if (node.children && node.children.length > 0) {
                        collapseAll(node.children);
                    }
                });
            };
            collapseAll(treeData);
            const updateCollapse = (node) => {
                let descendantMatches = false;
                if (node.children && node.children.length > 0) {
                    node.children.forEach((child) => {
                        if (updateCollapse(child)) {
                            descendantMatches = true;
                        }
                    });
                }
                const selfMatches = node.nom.toLowerCase().includes(term.toLowerCase());

                if (!selfMatches && descendantMatches) {
                    newCollapsedNodes.delete(node.id);
                }
                return selfMatches || descendantMatches;
            };

            treeData.forEach((node) => {
                updateCollapse(node);
            });

            setCollapsedNodes(newCollapsedNodes);
        }
    };

    const getAllNodeIds = (node) => {
        let ids = [node.id];
        if (node.children && node.children.length > 0) {
            node.children.forEach((child) => {
                ids = ids.concat(getAllNodeIds(child));
            });
        }
        return ids;
    };

    const findNodeById = (nodes, id) => {
        for (const node of nodes) {
            if (node.id === id) {
                return node;
            }
            if (node.children) {
                const found = findNodeById(node.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const removeNodeFromTree = (nodes, nodeIdToRemove) => {
        return nodes
            .filter((node) => node.id !== nodeIdToRemove)
            .map((node) => ({
                ...node,
                children: node.children ? removeNodeFromTree(node.children, nodeIdToRemove) : [],
            }));
    };

    function addChildToTree(nodes, parentId, newChild) {
        return nodes.map(node => {
            if (node.id === parentId) {
                const updatedChildren = node.children ? [...node.children, newChild] : [newChild];
                return {...node, children: updatedChildren};
            }
            if (node.children) {
                return {...node, children: addChildToTree(node.children, parentId, newChild)};
            }
            return node;
        });
    }

    const handleDeleteNode = async (node) => {
        try {
            await apiRequest(`/api/bien/${node.id}`, 'DELETE');

            const parentIds = collectParentIds(treeData, node.id);
            const directParentId = parentIds && parentIds.length > 0 ? parentIds[parentIds.length - 1] : null;
            const directParent = directParentId ? findNodeById(treeData, directParentId) : null;

            setTreeData((prevTree) => removeNodeFromTree(prevTree, node.id));
            setFilteredTreeData((prevTree) => removeNodeFromTree(prevTree, node.id));
            setOpenModalConfirmDelete(false);
            addToast({message: i18n.t('deleteConfirmationTitle'), type: 'success'});
            if (selectedNode.id === bien.id) {
                router.push('/bien');
            }
            if (selectedNode?.id === node.id) {
                setSelectedNode(directParent || bien);
            }
        } catch (error) {
            addToast({message: i18n.t('errorMessage'), type: 'error'});
        }
    };

    const renderTree = (nodes, level = 0) => {
        return (
            <ul className={`pl-${level * 4}`}>
                {nodes.map((node) => (
                    <li key={node.id} className={`mb-2 mt-1 ml-${level * 2}`}>
                        <div className="flex items-center">
                            {node.children && node.children.length > 0 ? (
                                <button
                                    onClick={() => toggleNodeCollapse(node.id)}
                                    className="mr-2 text-sm text-gray-600 hover:text-primary"
                                >
                                    {collapsedNodes.has(node.id) ? <FaPlus/> : <FaMinus/>}
                                </button>
                            ) : (
                                <span className="mr-2 w-4"/>
                            )}
                            <button
                                onClick={() => setSelectedNode(node)}
                                className={`w-full text-left p-2 rounded-md ${
                                    selectedNode?.id === node.id
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                {node.nom}
                            </button>
                        </div>
                        {node.children && !collapsedNodes.has(node.id) && renderTree(node.children, level + 1)}
                    </li>
                ))}
            </ul>
        );
    };

    if (!treeData) {
        return <div>{i18n.t("loading")}</div>;
    }

    return (
        <div className="flex h-full bg-gray-50">
            {/* Section Arborescence */}
            <div className="w-1/3 p-4 border-r border-gray-200 bg-white h-full">
                <h2
                    className={`text-lg font-bold mb-4 px-3 rounded py-1 ${
                        selectedNode?.id === bien.id
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    onClick={() => setSelectedNode(bien)}
                >
                    {bien.nom}
                </h2>
                <TextInput
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder={i18n.t("searchPlaceholder")}
                    className=" m-4"
                />
                <div className="overflow-y-auto max-h-[560px]">
                    {renderTree(filteredTreeData)}
                </div>
            </div>

            {/* Section Détails et édition */}
            <div className="w-2/3 p-4 bg-white">
                {selectedNode ? (
                    <Tab.Group>
                        <Tab.List className="flex space-x-4 border-b border-gray-200">
                            {['PATRIMOINE', 'GMAO', 'SANDRE', 'DATA'].map((tab) => (
                                <Tab
                                    key={tab}
                                    className={({selected}) =>
                                        `px-4 py-2 rounded-t-md text-sm font-medium ${
                                            selected
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-100 text-black hover:bg-gray-200'
                                        }`
                                    }
                                >
                                    {tab}
                                </Tab>
                            ))}
                        </Tab.List>
                        <Tab.Panels className="mt-4">
                            <Tab.Panel>
                                <div className="flex flex-row justify-between mb-4">
                                    <h3 className="text-2xl font-bold text-primary">{selectedNode.nom}</h3>
                                    <div className="flex flex-row gap-4">
                                        <BioButton
                                            color="primary"
                                            onClick={() => router.push(`/bien/${selectedNode.id}`)}
                                        >
                                            <FaLink/>
                                        </BioButton>
                                        {selectedNode.nature !== 'composant' && (
                                            <BioButton
                                                color="primary"
                                                onClick={() => setOpenAddModal(true)}
                                            >
                                                <FaPlus/>
                                            </BioButton>
                                        )}
                                        <BioButton
                                            color="failure"
                                            onClick={() => setOpenModalConfirmDelete(true)}
                                        >
                                            <FaTrashAlt/>
                                        </BioButton>
                                    </div>
                                    {openAddModal && (
                                        <ChildAdditionModal
                                            selectedNode={selectedNode}
                                            onChildAdded={(newChild) => {
                                                const adaptedChild = {
                                                    ...newChild,
                                                    children: newChild.equipements || [],
                                                    nature: newChild.typeBien.nature,
                                                };
                                                if (selectedNode.id === bien.id) {
                                                    setTreeData((prevTree) => [...prevTree, adaptedChild]);
                                                    setFilteredTreeData((prevTree) => [...prevTree, adaptedChild]);
                                                } else {
                                                    setTreeData((prevTree) =>
                                                        addChildToTree(prevTree, selectedNode.id, adaptedChild)
                                                    );
                                                    setFilteredTreeData((prevTree) =>
                                                        addChildToTree(prevTree, selectedNode.id, adaptedChild)
                                                    );
                                                }
                                                setCollapsedNodes((prev) => {
                                                    const newSet = new Set(prev);
                                                    newSet.delete(selectedNode.id);
                                                    return newSet;
                                                });
                                            }}
                                            onClose={() => setOpenAddModal(false)}
                                        />
                                    )}
                                </div>
                                {nodeDetail?.length > 0 &&
                                    <div className="border p-2 shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <h2 className="font-bold text-black">{i18n.t("characteristics")}</h2>
                                        </div>
                                        <div className={'grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-4'}>
                                            {nodeDetail?.map((caract) => (
                                                <div
                                                    key={caract.caracteristique.id}
                                                    className="p-2 bg-gray-100 rounded-md shadow-md"
                                                >
                                                <span className="text-sm font-medium text-gray-800">
                                                    {caract.caracteristique.nom}{' '}
                                                    {caract.caracteristique.unite
                                                        ? '(' + caract.caracteristique.unite?.libelle + ')'
                                                        : ''}
                                                </span>
                                                    {isEditingAll ? (
                                                        <DynamicInput
                                                            caracteristique={caract.caracteristique}
                                                            value={
                                                                editedCaracteristiques[caract.caracteristique.id] ||
                                                                caract.valeur
                                                            }
                                                            onChange={(value) =>
                                                                setEditedCaracteristiques({
                                                                    ...editedCaracteristiques,
                                                                    [caract.caracteristique.id]: value,
                                                                })
                                                            }
                                                            showLabel={false}
                                                        />
                                                    ) : (
                                                        <p className="mt-1 text-sm text-gray-600">{caract.valeur}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        {isEditingAll ? (
                                            <div className={'flex flex-row mt-2 justify-between'}>
                                                <BioButton color={'gray'} onClick={() => setIsEditingAll(false)}>
                                                    <FaTimes className="mt-0.5 mr-2"/> {i18n.t('cancel')}
                                                </BioButton>
                                                <BioButton color={'success'}
                                                           onClick={() => handleSaveCaracteristiques()}
                                                           className={'ml-auto'}>
                                                    <FaSave className="mt-0.5 mr-2"/> {i18n.t('save')}
                                                </BioButton>
                                            </div>
                                        ) : (
                                            <BioButton
                                                color={"primary"}
                                                onClick={() => setIsEditingAll(true)}
                                                className={'ml-auto mt-2'}
                                            >
                                                <FaEdit size={15} className="mt-0.5 mr-2"/> {i18n.t('edit')}
                                            </BioButton>
                                        )
                                        }
                                    </div>
                                }
                            </Tab.Panel>
                            <Tab.Panel>
                                <h3 className="text-lg font-bold text-primary">GMAO</h3>
                                <p>Content for GMAO goes here.</p>
                            </Tab.Panel>
                            <Tab.Panel>
                                <h3 className="text-lg font-bold text-primary">SANDRE</h3>
                                <p>Content for SANDRE goes here.</p>
                            </Tab.Panel>
                            <Tab.Panel>
                                <h3 className="text-lg font-bold text-primary">DATA</h3>
                                <p>Content for DATA goes here.</p>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                ) : (
                    <div className="flex justify-center items-center h-full">
                        <h3 className="text-5xl font-bold text-primary">{i18n.t("selectNode")}</h3>
                    </div>
                )}
            </div>
            <Modal show={openModalConfirmDelete} size={'3xl'} onClose={() => setOpenModalConfirmDelete(false)} popup>
                <Modal.Header/>
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle
                            className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"/>
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            {i18n.t("deletBienTitle")}
                        </h3>
                        <p className="text-left">{i18n.t('deleteBienInfo')}</p>
                        <p className="my-5 font-bold">{i18n.t('deleteSiteQuestion')}</p>
                        <div className="flex justify-center gap-4">
                            <BioButton color="failure" onClick={() => handleDeleteNode(selectedNode)}>
                                {i18n.t("confirm")}
                            </BioButton>
                            <BioButton color="gray" onClick={() => setOpenModalConfirmDelete(false)}>
                                {i18n.t("cancel")}
                            </BioButton>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}
