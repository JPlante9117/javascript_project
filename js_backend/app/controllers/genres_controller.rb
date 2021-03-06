class GenresController < ApplicationController
  before_action :set_genre, only: [:show, :update, :destroy]

  # GET /genres
  def index
    @genres = Genre.all
    options = {
      include: [:games, :category]
    }
    render json: @genres
  end

  # GET /genres/1
  def show
    options = {
      include: [:games, :category]
    }
    render json: @genre
  end

  # POST /genres
  def create
    @genre = Genre.new(genre_params)

    if @genre.save
      render json: @genre, status: :created, location: @genre
    else
      render json: @genre.errors, status: :unprocessable_entity
    end
  end

  # DELETE /genres/1
  def destroy
    @genre.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_genre
      @genre = Genre.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def genre_params
      params.require(:genre).permit(:title, :game_id)
    end
end
