import React, { useEffect, useState, useCallback } from 'react';
import Layout from "../../layouts/pages/layout";
import UserService from "../../services/UserService";
import EditarPerfil from "../Perfil/EditarPerfil";


const Profile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState(null);

  const userService = UserService();

  const fetchUsers = useCallback(async () => {
      try {
          const fetchedUsers = await userService.obtenerUsuarios();
          if (fetchedUsers.length > 0) {
              setCurrentUser(fetchedUsers[0]);
          }
      } catch (err) {
          setError(err.message || "Error al cargar los datos del usuario");
      } finally {
          setLoading(false);
      }
  }, [userService]);

  useEffect(() => {
      fetchUsers();
  }, [fetchUsers]);

    const handleEditPhotoClick = () => {
        setIsEditingPhoto(true);
        setUploadSuccessMessage(null); // Limpiar cualquier mensaje de éxito anterior
    };

    const handleCancelEditPhoto = () => {
        setIsEditingPhoto(false);
        setUploadSuccessMessage(null); // Limpiar cualquier mensaje de éxito
    };

    const handleProfileUpdated = (updatedUser) => {
        setCurrentUser(updatedUser);
        setIsEditingPhoto(false);
        setUploadSuccessMessage('¡Foto de perfil actualizada con éxito!'); // Mostrar mensaje de éxito
        // Aquí podrías realizar otras acciones después de la actualización del perfil
    };
   
    if (loading) {
        return (
            <Layout>
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p>Cargando perfil...</p>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="text-center py-5">
                    <p className="text-danger">Error al cargar el perfil: {error}</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Page Title */}
            <div className="page-title-box">
                <div className="row align-items-center">
                    <div className="col-auto">
                        <h4 className="page-title">Perfil</h4>
                        
                    </div>
                </div>
            </div>

            <div className="row mb-10">
                <div className="col-xl-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <div className="text-center">
                                {isEditingPhoto ? (
                                    <EditarPerfil
                                        currentUser={currentUser}
                                        onProfileUpdated={handleProfileUpdated}
                                        onCancel={handleCancelEditPhoto}
                                    />
                                ) : (
                                    <>
                                       <div>
                                   <img
                                  src={
                                  currentUser?.foto_user 
                                 ? `${currentUser.foto_user}?${new Date().getTime()}` // Cache busting
                            : "/assets/images/users/avatar-4.jpg"
                        }
                        alt={`${currentUser?.name || 'Usuario'} ${currentUser?.apellidos || ''}`}
                        className="avatar-lg rounded-circle img-thumbnail"
                        onError={(e) => { 
                          e.target.onerror = null; 
                          e.target.src = "/assets/images/users/avatar-4.jpg";
                        }}
                      />
                    </div>
                    <button 
                      className="btn btn-sm btn-primary mt-2" 
                      onClick={handleEditPhotoClick}
                      data-testid="edit-photo-btn"
                    >
                      Editar Foto
                    </button>
                  </>
                                )}
                                  {uploadSuccessMessage && (
                                    <p className="text-success mt-2">{uploadSuccessMessage}</p>
                                )}
                                <h5 className="mt-3 mb-1">{currentUser?.name || ''} {currentUser?.apellidos || ''}</h5>
                                <p className="text-muted">{currentUser?.filial_id?.nombre_filial || 'Área no especificada'}</p>
                            </div>

                            <hr className="my-4" />

                            <div className="text-muted">
                               
                                <div className="table-responsive mt-4">
                                    <div>
                                        <p className="mb-1">Nombre :</p>
                                        <h5 className="font-size-16"> {currentUser?.name || ''} {currentUser?.apellidos || ''}</h5>
                                    </div>
                                    <div className="mt-4">
                                        <p className="mb-1">Rol :</p>
                                        <h5 className="font-size-16">{currentUser?.rol_user || 'Usuario'}</h5>
                                    </div>
                                    <div className="mt-4">
                                        <p className="mb-1">Email :</p>
                                        <h5 className="font-size-16">{currentUser?.email || ""}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             

        <div className="col-xl-8">
          <div className="card mb-0">
            {/* Nav tabs */}
            <ul className="nav nav-tabs nav-tabs-custom nav-justified" role="tablist">
              <li className="nav-item">
                <a className="nav-link active" data-bs-toggle="tab" href="#about" role="tab">
                  <i className="uil uil-user-circle font-size-20"></i>
                  <span className="d-none d-sm-block">About</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-bs-toggle="tab" href="#tasks" role="tab">
                  <i className="uil uil-clipboard-notes font-size-20"></i>
                  <span className="d-none d-sm-block">Tasks</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-bs-toggle="tab" href="#messages" role="tab">
                  <i className="uil uil-envelope-alt font-size-20"></i>
                  <span className="d-none d-sm-block">Messages</span>
                </a>
              </li>
            </ul>
            
            
              
             
          
          </div>
        </div>
        </div>

    </Layout>
  );
};

export default Profile;