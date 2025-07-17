import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiSend, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import StarRating from './StarRating';
import { avisService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ReviewForm = ({ prestataireId, onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const { user } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    if (rating === 0) {
      toast.error('Veuillez donner une note');
      return;
    }

    if (!user) {
      toast.error('Vous devez être connecté pour laisser un avis');
      return;
    }

    setIsSubmitting(true);

    try {
      const avisData = {
        ...data,
        note: rating,
        prestataireId: prestataireId
      };

      await avisService.create(avisData);
      
      toast.success('Avis ajouté avec succès ! Il sera visible après modération.');
      reset();
      setRating(0);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'avis:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de l\'ajout de l\'avis');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-600 mb-4">
          Vous devez être connecté pour laisser un avis
        </p>
        <a
          href="/login"
          className="btn-primary inline-flex items-center"
        >
          Se connecter
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Laisser un avis
        </h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Note avec étoiles */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note *
          </label>
          <StarRating
            rating={rating}
            interactive={true}
            size="lg"
            onChange={setRating}
            className="mb-2"
          />
          {rating > 0 && (
            <p className="text-sm text-gray-600">
              {rating === 1 && 'Très décevant'}
              {rating === 2 && 'Décevant'}
              {rating === 3 && 'Correct'}
              {rating === 4 && 'Bien'}
              {rating === 5 && 'Excellent'}
            </p>
          )}
        </div>

        {/* Titre de l'avis */}
        <div>
          <label htmlFor="titre" className="block text-sm font-medium text-gray-700 mb-2">
            Titre de votre avis
          </label>
          <input
            id="titre"
            type="text"
            {...register('titre', {
              maxLength: {
                value: 100,
                message: 'Le titre ne peut pas dépasser 100 caractères'
              }
            })}
            className={`input ${errors.titre ? 'input-error' : ''}`}
            placeholder="Résumez votre expérience en quelques mots"
          />
          {errors.titre && (
            <p className="mt-1 text-sm text-red-600">{errors.titre.message}</p>
          )}
        </div>

        {/* Commentaire */}
        <div>
          <label htmlFor="commentaire" className="block text-sm font-medium text-gray-700 mb-2">
            Votre avis *
          </label>
          <textarea
            id="commentaire"
            rows={4}
            {...register('commentaire', {
              required: 'Le commentaire est requis',
              minLength: {
                value: 10,
                message: 'Le commentaire doit contenir au moins 10 caractères'
              },
              maxLength: {
                value: 1000,
                message: 'Le commentaire ne peut pas dépasser 1000 caractères'
              }
            })}
            className={`input ${errors.commentaire ? 'input-error' : ''}`}
            placeholder="Décrivez votre expérience avec ce prestataire..."
          />
          {errors.commentaire && (
            <p className="mt-1 text-sm text-red-600">{errors.commentaire.message}</p>
          )}
        </div>

        {/* Recommandation */}
        <div className="flex items-center">
          <input
            id="recommande"
            type="checkbox"
            {...register('recommande')}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="recommande" className="ml-2 block text-sm text-gray-700">
            Je recommande ce prestataire
          </label>
        </div>

        {/* Boutons */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="btn-primary flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="loading-spinner mr-2"></div>
                Envoi...
              </>
            ) : (
              <>
                <FiSend className="w-4 h-4 mr-2" />
                Publier l'avis
              </>
            )}
          </button>
        </div>
      </form>

      {/* Note informative */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note :</strong> Votre avis sera examiné par notre équipe avant publication. 
          Merci de rester respectueux et constructif dans vos commentaires.
        </p>
      </div>
    </div>
  );
};

export default ReviewForm;