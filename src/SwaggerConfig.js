const SwaggerConfig = {
    "openapi": "3.0.0",
    "info": {
        "title": "Gestion des comptes API",
        "version": "1.0.0",
        "description": "API pour gérer comptes"
    },
    "servers": [
        {
            "url": "http://localhost:5000"
        }
    ],
    "paths": {
        "/signup": {
            "post": {
                "summary": "Creation d'un utilisateur",
                "requestBody": {
                    "content": {
                        "multipart/form-data": {
                            "schema": {
                                "properties": {
                                    "firstname": {
                                        "type": "string",
                                        "description": "Le prenom de l'utilisateur"
                                    },
                                    "lastname": {
                                        "type": "string",
                                        "description": "Le nom de famille de l'utilisateur"
                                    },
                                    "username": {
                                        "type": "string",
                                        "description": "Le nom d'utilisateur de l'utilisateur"
                                    },
                                    "email": {
                                        "type": "string",
                                        "description": "L'adresse email de l'utilisateur"
                                    },
                                    "dateOfBirth": {
                                        "type": "string",
                                        "description": "La date de naissance de l'utilisateur"
                                    },
                                    "sexe": {
                                        "type": "string",
                                        "description": "Le sexe l'utilisateur"
                                    },
                                    "password": {
                                        "type": "string",
                                        "description": "Le mot de passe de l'utilisateur"
                                    },
                                    "confirmPassword": {
                                        "type": "string",
                                        "description": "Confirmation du mot de passe de l'utilisateur"
                                    }
                                },
                                "required": ["firstname", "lastname", "username", "email", "dateOfBirth", "password", "confirmPassword"],
                                "exemple": {
                                    "firstname": "Steve",
                                    "lastname": "Nyobe",
                                    "username": "Steve Nyobe",
                                    "email": "nyobeelouga5@gmail.com",
                                    "dateOfBirth": "AAAA-MM-JJ",
                                    "sexe": "feminin",
                                    "password": "P@ssword123",
                                    "confirmPassword": "P@ssword123"
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "201": {
                        "description": "Utilisateur enregistre avec succes !"
                    },
                    "400": {
                        "description": "Veuillez renseigner des informations valides !"
                    },
                    "409": {
                        "description": "L'utilisateur existe deja. Veuillez choisir une autre adresse email !"
                    }
                }
            }
        },
        "/login": {
            "post": {
                "summary": "Authentification d'un utilisateur",
                "requestBody": {
                    "content": {
                        "multipart/form-data": {
                            "schema": {
                                "properties": {
                                    "email": {
                                        "type": "string",
                                        "required": "true"
                                    },
                                    "password": {
                                        "type": "string",
                                        "required": "true"
                                    }
                                },
                                "required": ["email", "password"],
                                "exemple": {
                                    "email": "nyobeelouga5@gmail.com",
                                    "password": "P@ssword123"
                                }
                            }
                        }
                    }
                },

                "responses": {
                    "200": {
                        "description": "Authentification reussie !"
                    },
                    "400": {
                        "description": "Les informations fournies sont incorrectes !"
                    },
                    "401": {
                        "description": "identifiant ou mot de passe incorrect !"
                    }
                }
            }
        },
        "/get": {
            "get": {
                "summary": "Récupération d'un utilisateur par email",
                "parameters": [
                    {
                        "name": "email",
                        "in": "query",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK"
                    },
                    "400": {
                        "description": "Erreur lors de la rechercher de l\'utilisateur !"
                    },
                    "409": {
                        "description": "Utilisateur n'existe pas !"
                    }
                }
            }
        },
        "/getAll": {
            "get": {
                "summary": "Recuperation de la liste de utilisateurs",
                "responses": {
                    "200": {
                        "description": "Liste des utilisateurs !"
                    },
                    "404": {
                        "description": "Liste des utilisateurs est vide !"
                    },
                    "400": {
                        "description": "Erreur lors de la recuperation de la liste des utilisateurs !"
                    }
                }
            }
        },
        "/passforgot": {
            "put": {
                "summary": "Modification des informations d'un utilisateur",
                "requestBody": {
                    "content": {
                        "multipart/form-data": {
                            "schema": {
                                "properties": {
                                    "email": {
                                        "type": "string",
                                        "description": "L'adresse email de l'utilisateur"
                                    },
                                    "password": {
                                        "type": "string",
                                        "description": "L'ancien mot de passe de l'utilisateur"
                                    },
                                    "newpassword": {
                                        "type": "string",
                                        "description": "Le nouveau mot de passe de l'utilisateur"
                                    }
                                },
                                "required": ["email", "password", "newpassword"],
                                "exemple": {
                                    "email": "nyobeelouga5@gmail.com",
                                    "password": "P@ssword123",
                                    "newpassword": "c%hien123"
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "201": {
                        "description": "Mise a jour effectuee avec succes !"
                    },
                    "401": {
                        "description": "identifiant ou mot de passe incorrect !"
                    },
                    "400": {
                        "description": "Erreur lors de la'analyse des informations !"
                    }
                }
            }
        },
        "/delete": {
            "delete": {
                "summary": "Suppression du compte d'un utilisateur (fonctionnalite exclusive aux administrateurs)",
                "requestBody": {
                    "content": {
                        "multipart/form-data": {
                            "schema": {
                                "properties": {
                                    "email": {
                                        "type": "string",
                                        "required": true
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Utilisateur supprime avec succes !"
                    },
                    "400": {
                        "description": "Une erreur est survenue lors de la suppression de compte"
                    },
                    "404": {
                        "description": "Utilisateur non trouve !"
                    }
                }
            }
        },
        "/deleteAll": {
            "delete": {
                "summary": "Suppression de tous les comptes utilisateur (fonctionnalite exclusive aux administrateurs)",
                "responses": {
                    "200": {
                        "description": "Tous les documents ont été supprimés avec succès !"
                    },
                    "500": {
                        "description": "Une erreur est survenue lors de la suppression des comptes !"
                    }
                }
            }
        },
        "/deleteUser": {
            "delete": {
                "summary": "Suppression d'un compte utilisateur",
                "requestBody": {
                    "content": {
                        "multipart/form-data": {
                            "schema": {
                                "properties": {
                                    "email": {
                                        "type": "string",
                                        "description": "L'adresse email de l'utilisateur"
                                    },
                                    "password": {
                                        "type": "string",
                                        "description": "Le mot de passe de l'utilisateur"
                                    }
                                },
                                "required": ["email", "password"],
                                "exemple": {
                                    "email": "nyobeelouga5@gmail.com",
                                    "password": "P@ssword123"
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Compte supprime avec succes !"
                    },
                    "404": {
                        "description": "Aucun utilisateur avec cette adresse mail n'a ete trouve dans la base de donnees !"
                    },
                    "400": {
                        "description": "Une erreur est survenue lors de la suppression du compte, Veuillez renseigner tous les champs !"
                    }
                }
            }
        },
    }
}


module.exports = SwaggerConfig;