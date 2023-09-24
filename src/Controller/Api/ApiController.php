<?php

declare(strict_types=1);
namespace App\Controller\Api;

use App\Entity\Eleve;
use App\Entity\Presence;
use App\Entity\Inscription;
use App\Repository\CoursRepository;
use App\Repository\EleveRepository;
use App\Repository\PresenceRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\InscriptionRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route(path: '/api', name: 'app_api')]
class ApiController extends AbstractController
{
	
	/**
	 * return all cours of amea
	*/
	#[Route(path: '/cours', name: 'app_api_cours')]
	public function getListCours(SerializerInterface $serializer,CoursRepository $coursRepository,Request $request)
	{
		$data = json_decode($request->getContent(), true);

		$cours = $coursRepository->findCoursByProfName($data['prof']);

		if (!$cours) {
			return new Response('Aucun cours trouvé pour ce professeur.', 200);
		}

		return new Response(
			$serializer->serialize($cours, 'json', ['attributes' => ['id', 'name', 'prof']]),
			200,
			['Content-Type' => 'application/json']
		);
	}

	/**
	 * return all cours of amea
	*/
	#[Route(path: '/inscription/cours', name: 'app_api_inscription')]
	public function getListInscriptionCours(SerializerInterface $serializer,InscriptionRepository $inscriptionRepository,Request $request)
	{
		
		$data = json_decode($request->getContent(), true);

		$inscriptions = $inscriptionRepository->findBy(['cours' => $data['cours']]);

		if (!$inscriptions) {
			return new Response('Aucun eleve trouvé pour ce cours.', 200);
		}

		return new Response(
			$serializer->serialize($inscriptions, 'json', ['groups' => 'inscription']),
			200,
			['Content-Type' => 'application/json']
		);
	}

	/**
	 * return all cours of amea
	*/
	#[Route(path: '/presence/create', name: 'app_api_presence_create')]
	public function createPresence(Request $request, EntityManagerInterface $entity,EleveRepository $eleveRepository,CoursRepository $coursRepository,PresenceRepository $presenceRepository)
	{
		
		$data = json_decode($request->getContent(), true);

		$eleve = $eleveRepository->find($data['eleve']);
		$cours = $coursRepository->find($data['cours']);
		
		$presence = $presenceRepository->findBy(['nom' => $data['cours'],'eleve' => $data['eleve']]);

		if($presence) {
			$response = new Response('deja present', 200);
		}else {

			$presence = new Presence();
			$presence->setEleve($eleve);
			$presence->setNom($cours);
			$presence->setStatut(1);

			$entity->persist($presence);
			
			$entity->flush();
			$response = new Response('ok', 200);
		}
		return $response;
	}


	/**
	 * return all presence
	*/
	#[Route(path: '/presence', name: 'app_api_presence')]
	public function getPresence(Request $request, EntityManagerInterface $entity,PresenceRepository $presenceRepository,SerializerInterface $serializer)
	{
		
		$data = json_decode($request->getContent(), true);
		
		$presence = $presenceRepository->findBy(['nom' => $data['cours']]);

		return new Response(
			$serializer->serialize($presence, 'json', ['groups' => 'presence']),
			200,
			['Content-Type' => 'application/json']
		);
	}

	/**
	 * create eleve
	*/
	#[Route(path: '/eleve/create', name: 'app_api_eleve_create')]
	public function createEleve(Request $request, EntityManagerInterface $entity,EleveRepository $eleveRepository,CoursRepository $coursRepository)
	{
		
		$data = json_decode($request->getContent(), true);

		$cours = $coursRepository->find($data['cours']);

		$eleve = new Eleve();
		$eleve->setName($data['eleve']['name']);
		$eleve->setFirstname($data['eleve']['firstname']);
		$eleve->setMail($data['eleve']['email']);
		$eleve->setPhone($data['eleve']['number']);
		$eleve->setStatus(0);
		$entity->persist($eleve);
		
		$inscription = new Inscription();
		$inscription->setEleve($eleve);
		$inscription->setCours($cours);
		$inscription->setMontant(0);
		$entity->persist($inscription);
		
		$entity->flush();
	
		return new Response('ok', 200);
	}


}
