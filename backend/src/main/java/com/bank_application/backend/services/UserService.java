package com.bank_application.backend.services;

import java.util.List;
import java.util.Optional;

//This is Service Class

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bank_application.backend.entity.User;
import com.bank_application.backend.repository.UserRepo;

@Service
public class UserService {
	
	@Autowired
	UserRepo userRepo;
	
	public List<User> getAllUser() {
		return userRepo.findAll();
	}
	
	public User getUser(String mobileNumber) {
		return userRepo.getByMobileNumber(mobileNumber);
	}
	
	public User createUser(User user) {
		 return userRepo.save(user);
		 
	}
	
	public User updateUser(long id ,User user) {
		User existingUser = userRepo.findById(id)
				.orElseThrow(()-> new RuntimeException("User not found with the id :"+id));
		
		existingUser.setEmail(user.getEmail());
		existingUser.setName(user.getName());
		existingUser.setPassword(user.getPassword());
		
		return userRepo.save(existingUser);
		
	}
	
	public boolean deleteUser(Long id) {
		Optional<User> existingUser = userRepo.findById(id);
		
		if(existingUser.isPresent()) {
			userRepo.delete(existingUser.get());
			return true;
		}
		return false;
	}

	
	
}
